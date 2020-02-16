from scipy.signal import wiener
from statistics import mean
arr = [1000,1200,1900,1500,900,1800]
print(mean(wiener(arr)))