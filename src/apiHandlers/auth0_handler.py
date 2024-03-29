import os
from dotenv import load_dotenv
from auth0.management import Auth0
from auth0.authentication import GetToken
import time
import re
import pandas as pd

"""
This class is used to manage users programmatically in the auth0 database. The class shouldn't be confused with the
Auth0API-class which is used in the backend.

Below link can be used for documentation on the API. This class is used to manage users in the auth0 database.
https://auth0.com/docs/api/management/v2
Below link can be used for documentation on the python SDK.
https://github.com/auth0/auth0-python
"""


class Auth0Handler:
    def __init__(self):
        script_directory = os.path.dirname(os.path.abspath(__file__))

        load_dotenv(os.path.join(script_directory, '../..', '.env.local'))

        client_id = os.getenv('AUTH0_CLIENT_ID')
        client_secret = os.getenv('AUTH0_CLIENT_SECRET')
        domain = os.getenv('AUTH0_DOMAIN')
        api_url = os.getenv('AUTH0_API_URL')

        get_token = GetToken(domain=domain, client_id=client_id, client_secret=client_secret)
        token_info = get_token.client_credentials(api_url)

        mgmt_api_token = token_info['access_token']
        self.auth0 = Auth0(domain=domain, token=mgmt_api_token)
        self.userHandler = self.auth0.users

    def get_user(self, user_id):
        return self.userHandler.get(user_id)

    def create_user(self, data):
        return self.userHandler.create(data)

    def delete_user(self, user_id):
        return self.userHandler.delete(user_id)

    def update_user(self, user_id, data):
        return self.userHandler.update(user_id, data)

    def get_users(self):
        page = 0
        per_page = 50
        all_users = []

        while True:
            users_page = self.userHandler.list(page=page, per_page=per_page)['users']
            all_users.extend(users_page)

            if len(users_page) < per_page:
                break
            page += 1

        return all_users

    # This method is used to update building, apartment and laundryBuilding in the app_metadata of the user.
    def update_user_metadata(self, user):
        user_id = user['user_id']
        user_name = user.get('name', '')
        app_metadata = user.get('app_metadata', {})

        updated_attrs = {'laundryBuilding': False, 'building': False, 'apartment': False}

        # Extract building and apartment
        building = extract_building(user_name)
        apartment = extract_apartment(user_name)

        # Check and update building
        if building and app_metadata.get('building') != building:
            app_metadata['building'] = building
            updated_attrs['building'] = True

        # Check and update apartment
        if apartment and app_metadata.get('apartment') != apartment:
            app_metadata['apartment'] = apartment
            updated_attrs['apartment'] = True

        # Determine and update laundryBuilding
        laundry_building = determine_laundry_building(user_name)
        if laundry_building and app_metadata.get('laundryBuilding') != laundry_building:
            app_metadata['laundryBuilding'] = laundry_building
            updated_attrs['laundryBuilding'] = True

        # Update the user if any attribute needs updating
        if any(updated_attrs.values()):
            self.userHandler.update(user_id, {'app_metadata': app_metadata})

        return updated_attrs


def extract_building(user_name):
    building_match = re.search(r'[A-Za-z]+', user_name)
    return building_match.group(0) if building_match else None


def extract_apartment(user_name):
    apartment_match = re.search(r'\d+[A-Za-z]?$', user_name)
    return apartment_match.group(0) if apartment_match else ''


def determine_laundry_building(user_name):
    if user_name.startswith(('A', 'B', 'C', 'D')):
        return 'ARKIVET'
    # At the time of writing, people living in FH launder at NATIONSHUSET
    elif user_name.startswith(('admin', 'NH', 'GH', 'FH')):
        return 'NATIONSHUSET'
    return None


if __name__ == "__main__":
    auth0 = Auth0Handler()

    df = pd.read_excel('arkivet_users.xlsx')

    created_users_count = 0
    for index, row in df.iterrows():
        
        # Extract name and email from the corresponding columns
        name = row[0]  # Assuming 'name' is in column A
        email = row[3]  # Assuming 'email' is in column D
        print(f"Name: {name}, Email: {email}")

        # Skip the rows which don't have name and email
        if not name or not email:
            continue

        # remove whitespace from name and email
        name = name.strip() if name else None
        email = email.strip() if email else None

        new_user_template = {
            "name": f"{name}",
            "email": f"{email}",
            "connection": "Username-Password-Authentication",
            "password": f"{name}",
            "email_verified": False,
            "app_metadata": {
                "acceptedTerms": False,
                "allowedSlots": 1,
                "roles": ["user"],
                "building": f"{extract_building(name)}",
                "apartment": f"{extract_apartment(name)}",
                "laundryBuilding": "ARKIVET",
                "user_metadata": {
                    "telephone": ""
                }
            }
        }
        auth0.create_user(new_user_template)

        created_users_count += 1

        # Sleep for 1 second to avoid rate limiting
        time.sleep(1)

    print(f"Created {created_users_count} users")
