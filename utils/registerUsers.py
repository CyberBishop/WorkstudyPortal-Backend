import os
import openpyxl
import requests

print(os.getcwd())

API_URL = 'http://127.0.0.1:3000/users/register'

# Open the Excel workbook and select the active sheet
workbook = openpyxl.load_workbook(f'{os.getcwd()}/utils/users.xlsx')
worksheet = workbook.active

# Iterate through the rows in the worksheet, starting from row 2
for row in worksheet.iter_rows(min_row=2, values_only=True):
    # Extract the data from the current row
    name, matric_no, dept, level, email, placement = row[1:7]
    if not name:
        break

    # print(name, matric_no, dept, level, email, placement)
    # Make the API request to register the user
    response = requests.post(API_URL, json={
        'username': matric_no,
        'password': matric_no,
        'email': email,
        'fullname': name,
        'placement': placement,
        'course': dept,
        'level': level,
    })

    # Check the response status code and print a message
    if "uuid" in response.json():
        print(f'Registered user {name} with email {email}')
    else:
        print(f'Error registering user {name} with email {email}')
