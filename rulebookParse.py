import string

import pymongo
import pandas as pd

##Connects to my mongodb
myClient = pymongo.MongoClient("mongodb+srv://natedaulo:k5bJG8KBb45NZqLm@testcluster.nqb3fca.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster")

exaltedDb = myClient["Exalted"]
charmDb = exaltedDb["Charms"]



inputFile = open(r"C:\Users\Anthony Daulo-PC\Downloads\CS380Project-main (1)\CS380Project-main\web-scraper-jsoup\finalFixedExalted.txt", "r")

textRaw = inputFile.read()
text = textRaw.splitlines()
i = 0


currentPage = 255


bodyTextFlag = False
charmList = []
charmNameString = "N/A"
costString = "N/A"
minsString = "N/A"
typeString = "N/A"
keywordString = "N/A"
durationString= "N/A"
prereqString = "N/A"
bodyTextString = "N/A"

pageString = currentPage




while i < len(text):

    ##Takes a page number out of any given line
    if "EX3" in text[i]:
        text[i] = text[i].replace("EX3", '')
        currentPage = text[i][:3]
        text[i] = text[i][3:]


    ##Special case if last line in file
    if i + 1 == len(text):
        bodyTextString = '/n'.join(map(str,bodyText))

    else:
        ##Determines if it's a title of a charm
        if "Cost:" in text[i+1]:
        
            print("Title")
            #Since it's start of a new charm. Upload previous charm to db and reset all variables
            if bodyTextFlag == True:
                bodyTextFlag = False
                bodyTextString = '/n'.join(map(str,bodyText))
                charmList.append({"Name" : charmNameString, "Cost" : costString, "Mins" : minsString, "Types": typeString, "Keyword" : keywordString, "Duration" : durationString,  "Prereq" : prereqString, "BodyText": bodyTextString, "Page#" : pageString})

            charmNameString = text[i]
        ##Determines if it's a cost line and extracts min charms and cost line
        elif "Cost:" in text[i]:
            print("Cost")
            tempList = text[i].split(";")
            costString = tempList[0]
            minsString = tempList[1]

            costString = costString.replace("Cost:  ", '')
            minsString = minsString.replace("Mins:  ", '')
        elif "Type:" in text[i]:
            print("Type")
            typeString = text[i].replace("Type:  ", '')
            typeString = typeString.replace("\\n", '')
        ##Determines if it's a keyword line
        elif "Keywords:" in text[i]:
            print("Keywords")
            keywordString = text[i].replace("Keywords:  ", '')
            keywordString = keywordString.replace("\\n", '')
        #Determines if it's a duration line
        elif "Duration:  " in text[i]:
            print("Duration")
            durationString = text[i].replace("Duration:  ", '')
            durationString = durationString.replace("\\n", '')
        #Determines if it's a Prereq lines
        elif "Prerequisite Charms:" in text[i]:
            print("Prereq")
            prereqString = text[i].replace("Prerequisite Charms:  ", '')
            prereqString = prereqString.replace("\\n", '')
        ##If everything else fails it must be a part of the body/rulees text
        else:
            ##Case if it's the first line of body text for the charm
            if bodyTextFlag == False:
                print("BodyStart")
                bodyTextFlag = True
                bodyText = []
                bodyText.append(text[i])
                pageString = currentPage
            ##Case if it's not the first line of body text
            else:
                print("Body")
                bodyText.append(text[i])
    i = i + 1
            
charmList.append({"Name" : charmNameString, "Cost" : costString, "Mins" : minsString, "Types": typeString, "Duration" : durationString, "Prereq" : prereqString, "BodyText": bodyTextString, "Page#" : pageString})

charmDb.insert_many(charmList)
