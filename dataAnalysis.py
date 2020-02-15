"""
use https://developers.arcgis.com/labs/python/create-data/ to create data from python.

What we can do right now is store the monitor data into the folder called monitorData.
This file will take that data, apply cross correlation to it (because python
has the libraries and js doesn't), and then upload it to the arcGIS platform via REST.
"""

from scipy.signal import correlate
arr1 = [1,2,3,4]
arr2 = [1,2,3,4]
print(correlate(arr1,arr2))
