"""
use https://developers.arcgis.com/labs/python/create-data/ to create data from python.

What we can do right now is store the monitor data into the folder called monitorData.
This file will take that data, apply cross correlation to it (because python
has the libraries and js doesn"t), and then upload it to the arcGIS platform via REST.
"""
from arcgis.gis import GIS
from arcgis import geometry
from arcgis import features
from scipy.signal import correlate

gis = GIS("https://www.arcgis.com", username="sumguy002", password="2q4SNceu.*JQ5Fn")
data_file_location = "C:/Users/bryan/Downloads/LA_Hub_Datasets/LA_Hub_Datasets/Parks_and_Open_Space.zip"
data_file_location = "./monitordata/SampleCSVFile_2kb.csv"
def exportDataset(title, tags, type, file_location):
    properties = {
        "title": title,
        "tags": tags,
        "type": type #Shapefile,CSV, etc. See https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm
    }
    properties = {};
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
        print("Couldn't create the feature. {}".format(str(e))))
#deleteAllRemote()
#data_reference = exportDataset("sampletitle", "bello", "CSV", data_file_location)
query = 'title: "SampleCSVFile_2kb*"'
data_reference = gis.content.search(query=query)[0]
data_url = data_reference.url
feature_layers = data_reference.layers
trailheads_layer = feature_layers[0]
for field in trailheads_layer.properties['fields']:
    print('Name: {:16s}\tType: {}'.format(field['name'], field['actualType']))
m = gis.map()
m.center = [34.09042, -118.71511]           # `[latitude, longitude]`
m.zoom = 11
create_feature(m, [34.0941, -118.716])


#cross_correlate(arr1, arr2)
