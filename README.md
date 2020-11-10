# Basic Vehicle Incident Tracker
An example full-stack project written in .NET Core on the back and and React-Redux with Typescript on the front end.

This was originally built with Visual Studio's built in .NET Core Web Application template for React Redux.

The purpose of this project is to allow users to report a vehicle incident and the system will look up the make, model, and year based on the input VIN (Vehicle Identification Number).

Make sure to have the latest version of NodeJS installed as well as .NET Core 3.1 or above installed to build this project. 

You can use `npm install` from the ClientApp directory to install all dependencies in the front-end code. Though Visual Studio should build these during the build process. Both the front-end and back-end are built to run on the same localhost port.

You can use the instructions here as a reference for how I built the project originally: https://www.c-sharpcorner.com/article/learn-about-react-app-with-visual-studio-2019/


The user can click on "View Incidents" in the top menu bar to view all added incidents which includes their model, make, and year of the car ased on the VIN. This uses an in-memory cache for the datastore, so upon initial build there will be no data visible. To add data click on the "Add New Incident" menu button.

http://randomvin.com/ is a useful website for getting VINs to test with.

The user can then filter their results with a search textbox and filter results by date with a start and end date. This is meant to be inclusive, so any incidents taking place on the selected day will be shown.

If a VIN with no associated model/make/year is input, that VIN will still be added but no model/make/year will be shown.

A VIN and a Date and Time are required fields when creating a new incident, but a Note is not. The maximum length for a VIN is 16 characters an the maximum length for a Note is 500 characters.

## Original assignment instructions (Specific information about the company has been removed): 
```
Thank you so much for taking your time to complete this take home test.

Please create a new project on Github that can be shared with us as your submission.  We will pull it down and run it along with tests.  The solution should include a client using React and a server in asp.net core along with instructions in Readme.md for how to build and run the application and the tests.

For saving time sake, please start with a React or React-Redux asp.net template such as https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-3.1&tabs=netcore-cli to bootstrap your project with cra and asp.net

Basic Vehicle Incident Tracker - As a diligent vehicle operator, I would like to track when a vehicle has been in an Incident.  

VIN definition

https://en.wikipedia.org/wiki/Vehicle_identification_number

Create an application which allows the user to do the following

1 - Create a vehicle Incident by entering a VIN, DateTime, and Note via a user interface 

(e.g. 2C3AA63H75H632197, Jan 1, 2020, Hit a Post)

2 - If the VIN has not been added before, decode it on the server using the online service https://vpic.nhtsa.dot.gov/api/ and save the attributes Make Model and Year for the VIN.

3 - Display  the list of all Incidents with columns VIN, DateTime, Note, Make, Model and Year

4 - Allow the user to filter the list by entering in a partial VIN number and/or a date range

(e.g.  a search for 2C3 should include the vin 2C3AA63H75H632197)

(e.g. a search for Jan 1 2019 to Jan 1 2021 should include the incident on Jan 1 2020)


For simplicity there is no requirement to maintain persistence of Incidents after server shutdown/restart. 

We value clean code, separation of concerns and testing. 

Here are some helpful resources.

 

Vin Decode service URL

https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json

 

Testing Vins

http://randomvin.com/

Full stack template

https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-3.1&tabs=netcore-cli

In-memory storage

https://entityframeworkcore.com/providers-inmemory
```
