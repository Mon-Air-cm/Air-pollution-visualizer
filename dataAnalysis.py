"""
use https://developers.arcgis.com/labs/python/create-data/ to create data from python.

What we can do right now is store the monitor data into the folder called monitorData.
This file will take that data, apply cross correlation to it (because python
has the libraries and js doesn"t), and then upload it to the arcGIS platform via REST.
"""
from arcgis.gis import GIS
from scipy.signal import correlate

gis = GIS("https://www.arcgis.com", username="sumguy002", password="2q4SNceu.*JQ5Fn")
#data_file_location = "C:/Users/bryan/Downloads/LA_Hub_Datasets/LA_Hub_Datasets/Parks_and_Open_Space.zip"
data_file_location = "./monitordata/blank.csv"
def exportDataset(title, tags, type, file_location):
    properties = {
        "title": title,
        "tags": tags,
        "type": type #stuff like Shapefile
    }
    shp = gis.content.add(properties, data=file_location)
    feature_layer_item = shp.publish()
    print("item", feature_layer_item, "successfully published")
def deleteAllRemote():
    gis.content.delete_items(gis.content.search(""))
def cross_correlate(arr1, arr2):
    print(correlate(arr1,arr2))
arr1 = [1,2,3,4]
arr2 = [1,2,3,4]


deleteAllRemote()
exportDataset("sampletitle2", "cello", "csv", data_file_location)
#cross_correlate(arr1, arr2)
