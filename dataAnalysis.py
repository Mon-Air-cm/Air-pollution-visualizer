"""
use https://developers.arcgis.com/labs/python/create-data/ to create data from python.

What we can do right now is store the monitor data into the folder called monitorData.
This file will take that data, apply cross correlation to it (because python
has the libraries and js doesn"t), and then upload it to the arcGIS platform via REST.
"""
from flask import Flask, jsonify
from flask_cors import CORS
import csv
from arcgis.gis import GIS
from arcgis import geometry
from arcgis import features
from scipy.signal import correlate

gis = GIS("https://www.arcgis.com", username="sumguy002", password="2q4SNceu.*JQ5Fn")
data_file_location = "C:/Users/bryan/Downloads/LA_Hub_Datasets/LA_Hub_Datasets/Parks_and_Open_Space.zip"
#data_file_location = "./monitordata/SampleCSVFile_2kb.csv"
data_file_location = "./sample_data.csv"
def exportDataset(title, tags, type, file_location):
    properties = {
        "title": title,
        "tags": tags,
        "type": type #Shapefile,CSV, etc. See https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm
    }
    shp = gis.content.add(properties, data=file_location)
    feature_layer_item = shp.publish()
    print("item", feature_layer_item, "successfully published")
    return feature_layer_item
def deleteAllRemote():
    gis.content.delete_items(gis.content.search(""))

def cross_correlate(arr1, arr2):
    print(correlate(arr1,arr2))
arr1 = [1,2,3,4]
arr2 = [1,2,3,4]

def create_feature(_map, location):
    try:
        object_id = 1
        point = geometry.Point(location)
        feature = features.Feature(
            geometry=point,
            attributes={
                'OBJECTID': object_id,
                'PARK_NAME': 'My Park',
                'TRL_NAME': 'Foobar Trail',
                'ELEV_FT': '5000'
            }
        )

        trailheads_layer.edit_features(adds=[feature])
        _map.draw(point)

    except Exception as e:
        print("Couldn't create the feature. {}".format(str(e)))

def CSVwrite(intended_file_path, listOLists):
    with open(intended_file_path, "w") as csvfile:
        print(csvfile)
        CSVWriter = csv.writer(csvfile, delimiter = ",", escapechar = " ", quoting=csv.QUOTE_NONE)
        for row in listOLists:
            CSVWriter.writerow(row)

def CSVparse(file_path):
    listOLists = []
    with open(file_path) as csvfile:
        readCSV = csv.reader(csvfile, delimiter = ",")
        for row in readCSV:
            listOLists.append(row)
    return listOLists

# DATA is a list of lists
def create_time_lapse(title, tags, type, file_path):
    #deleteAllRemote()
    listOItems = []
    data = CSVparse(file_path)
    time_scale_count = len(data[1][data[0].index("NOX_LEVELS")].split("$"))-3
    #units of time recorded, according to how many NOX level measurements there were
    deleteAllRemote()
    for time in range(time_scale_count):
        properties = {
            "title": title + str(time),
            "tags": tags,
            "type": type #Shapefile,CSV, etc. See https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm
        }
        write_path = "./monitordata/dataTime" + str(time)
        listOLists = []
        listOLists.append(data[0])
        for line in data[1:]:
            newOzone = line[5].split("$")[time]
            newSOx = line[6].split("$")[time]
            newNOx = line[4].split("$")[time]
            newline = line[:4]+[newNOx]+[newOzone]+[newSOx]
            listOLists.append(newline)
        CSVwrite(write_path, listOLists)
        shp = gis.content.add(properties, data=write_path)
        print(shp)
        feature_layer_item = shp.publish()
        listOItems +=[feature_layer_item]
    return listOItems

app = Flask(__name__)
CORS(app, supports_credentials = True)

listOItems = create_time_lapse("time", "tag", "CSV", "./monitordata/samplecsvfile_2kb.csv")
@app.route('/')
def get_urls():
    return jsonify({"listOItems": listOItems})
app.run()
#deleteAllRemote()
#data_reference = exportDataset("sampletitle", "bello", "CSV", data_file_location)
"""
query = 'title: "SampleCSVFile_2kb*"'
data_reference = gis.content.search(query=query)[0]
data_url = data_reference.url
feature_layers = data_reference.layers
trailheads_layer = feature_layers[0]
for field in trailheads_layer.properties['fields']:
    print('Name: {:16s}\tType: {}'.format(field['name'], field['actualType']))
"""
m = gis.map()
m.center = [34.09042, -118.71511]           # `[latitude, longitude]`
m.zoom = 11
#create_feature(m, [34.0941, -118.716])


#cross_correlate(arr1, arr2)
