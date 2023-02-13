# This file aims to read specified lists of users and insert them into Auth0 DB 
import os
import csv
import getopt, sys
from dotenv import load_dotenv
import requests
import re
import time

BUILDINGS = ["NH","GH","ARKIVET"]
ARKIVET_BUILDINGS = ["A","B","C","D"]

# Argument passing
argumentList = sys.argv[1:]
options = "htv"
long_options = ["Help", "testing","verbose"]
# Testing
TESTING_MODE = True
VERBOSE = True
try:
    arguments, values = getopt.getopt(argumentList, options, long_options)
    for currentArgument, currentValue in arguments:
 
        if currentArgument in ("-h", "--Help"):
            print ("Tool for importing users into auth0 as defined by parameters in env")
             
        elif currentArgument in ("-t", "--testing"):
            TESTING_MODE = True

        elif currentArgument in ("-v","--verbose"):
            VERBOSE = True
             
except getopt.error as err:
    # output error, and return with an error code
    print (str(err))

# indices of info # CHANGE THIS TO INCLUDE MORE FIELDS
CSV_IND = {"username": 0, "email":1}

load_dotenv()
my_id = os.getenv("AUTH0_CLIENT_ID")
secret = os.getenv("REACT_APP_SECRET")
url = os.getenv("AUTH0_ISSUER_BASE_URL")
token = os.getenv("AUTH0_TOKEN")

# Function for getting building name, user name must start with letters defined in
def assertBuilding(buildingName):
    regex = '^[A-Z]{1,2}'
    res = re.match(regex,buildingName)
    if(res in ARKIVET_BUILDINGS):
        return "ARKIVET"
    elif(res in BUILDINGS):
        return res
    else:
        return None

def run():
    fileDir = "utils/users/userLists" 
    folderName = os.path.join(os.getcwd(),fileDir)
    nFiles = ["tenants13223.csv"]
    if(not TESTING_MODE):
        print(os.getcwd())
        nFiles = os.listdir(folderName)
    nUsers = 0
    users = list()
    for index,file in enumerate(nFiles) :
        with open(os.path.join(folderName,file), 'r') as file:
            csvreader = csv.reader(file)
            for row in csvreader:
                users.append(row)
                nUsers += 1
    print("Found " + str(nUsers) +" Users in: " + str(nFiles))
    usrChoice = input("Proceed with user creation? [y/n]")
    if(usrChoice is "y"):
        ## Getting token
        endpoint = url + '/api/v2/users'
        #getHeaders = {"Authorization": "Bearer " + str(token)}
        #test = requests.get(endpoint, headers=getHeaders).json()
        # User creation
        print("---START---")
        nSucessfull = 0
        nFail = 0
        for user in users:
            email = user[CSV_IND["email"]]
            name = user[CSV_IND["username"]].upper()
            userBodyObject = {
                "email": email,
                "name": name,
                "password": name,
                "connection": "Username-Password-Authentication",
                "app_metadata":{"acceptedTerms" : False, "building":assertBuilding(name),"allowedSlots":1}
                }
            #body = {'client_id' : f'${my_id}', 'client_secret': f'${secret}', 'audience' : url, 'grant_type' : 'client_credentials'}
            postHeaders = {"Authorization": "Bearer " + str(token), "Content-Type": "application/json"}
            # Inspection of request
            #testReq = requests.Request("POST",endpoint,headers=postHeaders,json=userBodyObject)
            response = requests.post(endpoint, headers=postHeaders , json = userBodyObject)
            #print(response.json())
            
            if(response.ok):
                nSucessfull += 1
                if(VERBOSE):
                    print("Created: "+str(user[CSV_IND["username"]]))
            else:
                nFail += 1
                if(VERBOSE):
                    print("Failed creation of: "+str(user[CSV_IND["username"]]))
                    print(response.json())
            time.sleep(0.3)
        print("---SCRIPT SUMMARY---")
        print("Created: "+ str(nSucessfull)+" Failed: "+str(nFail))
    else:
        print("Exiting...")
     
      
if __name__ == '__main__':
    run()



