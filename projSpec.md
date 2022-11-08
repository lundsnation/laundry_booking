# Laundry Booking - Project specification 

## Background
This project will serve as a complete solution for managing boked laundry-times for tenants of Lunds Nation, Lund SE.
The projects authors are Adi Creson, Adam Schlyter och Axel Sneitz-Björkman. 

## Purpose 
Lunds Nation houses around 300 tenants in 275 apartments. All tenants have access to a laundryroom, housing 5 washing-machines, as well as space for hanging wet laundry to dry. Access to this room is divided into ten daily 
time-slots between the hours of 07:00 and 22:00, this means that each time slot has access to the washing machines for a duration of one hour and 30 minutes. In order to book laundry times fitting the tenants schedule, it is 
desirable to be able to book a time in advance. Previous system (as can be seen at http://victor.lerenius.se/tvatt/nationshuset/) featured a basic approach using a simple HTML-table to display time-slot availibility, aswell as 
which tenant has booked which time. Based on simple color coding (Gray, red and green) users could distinguish wheter or not a time-slot is passed in time, unavailible due to beeing booked by someone else or availible. The layout
initially displayed the current week, but the user could also scroll forward to weeks ahead, enabling users to book times in advance. 

The site also had a basic user authentication system, where each apartment has a unique identifier (Apartment number). Users also had the ability to choose a four-digit pincode for security. The pincode could be changed when a new tenant 
moved into an apertment, enabling the set of users to be static in nature. Sometime in 2021, this system failed due to unknown reasons, and since then, the mangament of times has been handled thorugh an online spreadsheet, being
less secure, more prone to tampering and generally requires more administration than the previous system. 

This project aims to replace this system entirely using state-of-the-art components and frameworks, to both create a stable, fast system and to give the authors a deeper understanding of full-stack engineering. The authors are 
currently (Nov 2022) students at Lunds Tekniska Högskola (M.Sc Comp. Eng., M.Sc Mech. Eng., M.Sc Elec. Eng.) and hope that this project will strengthen web-devlopment skills. 

## Tech-stack
       
For this project we want to offer complete solution as opposed to integrating components into an already deployed system, therefore we will specify all frameworks and components in the included in the project here:

### Database
The database will mainly keep track of which users has booked which times. Therefore the only data fields of interest would be: 
- `userID`
- `timeSlotBooked`

The data will be accessed thorugh basic HTTP api-calls such as GET & POST, and then processed in the frontend.  


#### Mongodb Atlas. 
Due to great integration and included web UI, mongodb Atlas will handle database storage and CRUD-operations. Mongodb Atlas is essentially free (512 MB, 500 Collections and 100 CRUD-operations/second for free-tier), enabling us to 
setup a functioning database very quickly. 
#### Mongoose Schemas
In order to represent data, we define a mongoose shcema-representation for our data, making operations on database-objects easier to write code for.  

### Backend
#### NextJs
good for smth idk
#### Auth0 
good for pass&user idk

### Frontend
React