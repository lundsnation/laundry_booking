# Laundry Booking - Project specification 

## Background
This project will serve as a complete solution for managing boked laundry-times for tenants of Lunds Nation, Lund SE.
The projects authors are Adi Creson, Adam Schlyter och Axel Sneitz-Björkman. 

## Purpose 
Lunds Nation houses around 300 tenants in 275 apartments. All tenants have access to a laundryroom, housing 5 washing-machines, as well as space for hanging wet laundry to dry. Access to this room is divided into ten daily 
time-slots between the hours of 07:00 and 22:00m this means that each time slot has access to the washing machines for a duration of one hour and 30 minutes. In order to book times fitting the tenants schedule, it is 
desirable to be able to book a time in advance. Previous system (as can be seen at http://victor.lerenius.se/tvatt/nationshuset/) featured a basic approach using a simple HTML-table to display time-slot availibility aswell as 
which tenant has booked which time. Based on simple color coding (Gray, red and green) users could distinguish wheter or not a time-slot is passed in time, unavailible due to beeing booked by someone else or availible. The layout
initially displayed the current week, but the user could also scroll forward to weeks ahead, enabling users to book times in advance. 

The site also had a basic user authentication system, where each apartment has a unique identifier (Apartment number), with the ability to choose a four-digit pincode for security. The pincode could be changed when a new tenant 
moved into an apertment, enabling the set of users to be static in nature. Sometime in 2021, this system failed due to unknown reasons and since then, the mangament of times has been handled thorugh an online spreadsheet, being
less secure, more prone to tempering and requires more administration than the previous system. 

This project aims to replace this system entirely using state-of-the-art components and frameworks, to both create a stable, fast system and to give the authors a deeper understanding of full-stack engineering. The authors are 
currently (Nov 2022) students at Lunds Tekniska Högskola (M.Sc Comp. Eng., M.Sc Mech. Eng., M.Sc Elec. Eng.) and hope that this project will strengthen web-devlopment skills. 

## Tech-stack
       
For this project we want to offer complete solution as opposed to integrating components into an already deployed system, therefore we will specify all frameworks and components in the included in the project here:

### Database
Mongodb Atlas

### Backend
NextJs

### Frontend
React
