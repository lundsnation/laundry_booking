import os
from dotenv import load_dotenv
from auth0.management import Auth0
from auth0.authentication import GetToken
import time

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

        self.client_id = os.getenv('AUTH0_CLIENT_ID')
        self.client_secret = os.getenv('AUTH0_CLIENT_SECRET')
        self.domain = os.getenv('AUTH0_API_DOMAIN')
        self.api_url = os.getenv('AUTH0_API_URL')

        get_token = GetToken(domain=self.domain, client_id=self.client_id, client_secret=self.client_secret)
        token_info = get_token.client_credentials(self.api_url)

        self.mgmt_api_token = token_info['access_token']
        self.auth0 = Auth0(domain=self.domain, token=self.mgmt_api_token)
        self.userHandler = self.auth0.users

    def get_users(self):
        page = 0
        per_page = 25
        all_users = []

        while True:
            users_page = self.userHandler.list(page=page, per_page=per_page)['users']
            all_users.extend(users_page)

            if len(users_page) < per_page:
                break
            page += 1

        return all_users

    def get_user_by_id(self, user_id):
        return self.userHandler.get(user_id)

    def update_user(self, user_id, body):
        return self.userHandler.update(user_id, body)

    def update_all_users(self, body):
        users = self.get_users()
        for user in users:
            self.update_user(user['user_id'], body)

    ##
    def count_users_with_attribute(self, attribute_name):
        users = self.get_users()
        count = 0
        users_with_attribute = []

        for user in users:
            user_metadata = user.get('user_metadata', {})
            app_metadata = user.get('app_metadata', {})

            if attribute_name in user_metadata or attribute_name in app_metadata:
                count += 1
                users_with_attribute.append(user.get('name'))

        return count, users_with_attribute


if __name__ == "__main__":
    auth0 = Auth0Handler()
    print(auth0.get_user_by_id("auth0|63eaa12106b5b69e0bdaa3ad"))

    """
    count, users_with_attribute = auth0.count_users_with_attribute('laundryBuilding')
    print(f"Users with attribute before: {count}")
    print(users_with_attribute)

    new_attribute_name = 'laundryBuilding'

    users = auth0.get_users()
    updated_users_count = 0
    
    for user in users:
        user_name = user.get('name', '')
        print("User name: ", user_name)

        if user_name:
            user_id = user['user_id']
            app_metadata = user.get('app_metadata', {})

            if user_name.startswith(('A', 'B', 'C', 'D')):
                print("User belongs to ARKIVET")
                app_metadata[new_attribute_name] = 'ARKIVET'
            elif user_name.startswith(('admin', 'NH', 'GH')):
                print("User belongs to GH")
                app_metadata[new_attribute_name] = 'NATIONSHUSET'

            auth0.update_user(user_id, {'app_metadata': app_metadata})

            updated_users_count += 1

            # Added sleep to avoid rate limit
            time.sleep(1)

    print(f"Total users: {len(users)}, Updated users: {updated_users_count}")

    count, users_with_attribute = auth0.count_users_with_attribute('laundryBuilding')
    print(f"Users with attribute after: {count}")
    print(users_with_attribute)
    """
