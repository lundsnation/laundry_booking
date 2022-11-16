# This file aims to read specified lists of users and insert them into Auth0 DB 
#import requests
import os
import csv
import sys
from dotenv import load_dotenv
import requests

load_dotenv()
my_id = os.getenv("AUTH0_CLIENT_ID")
secret = os.getenv("REACT_APP_SECRET")
url = os.getenv("AUTH0_ISSUER_BASE_URL")
token = os.getenv("AUTH0_TOKEN")
def run():
    fileDir = "utils/users/userLists" 
    folderName = os.path.join(os.getcwd(),fileDir)
    print(os.getcwd())
    nFiles = os.listdir(folderName)
    userNames = list()
    nUsers = 0
    for index,file in enumerate(nFiles) :
        with open(os.path.join(folderName,file), 'r') as file:
            csvreader = csv.reader(file)
            for row in csvreader:
                userNames.append(row)
                nUsers += len(row)
    #print("Found " + str(nUsers) +" Users in directory in " + str(nFiles) + " files")
    users = set([item for sublist in userNames for item in sublist])
    ## Testing token
    endpoint = url + '/api/v2/users'
    print("Testing :" + endpoint)
    headers = {"Authorization": "Bearer " + str(token)}
    test = requests.get(endpoint, headers=headers).json()
    pass
    #body = {'client_id' : f'${my_id}', 'client_secret': f'${secret}', 'audience' : url, 'grant_type' : 'client_credentials'}
    #response = requests.post(url, json = body)
    #print(response)

if __name__ == '__main__':
    run()