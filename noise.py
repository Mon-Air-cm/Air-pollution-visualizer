from sklearn.decomposition import FastICA
import seaborn as sns
import numpy as np
np.random.seed(0)
from scipy import signal
from scipy.io import wavfile
from matplotlib import pyplot as plt
import seaborn as sns
np.random.seed(0)
n_samples = 2000
time = np.linspace(0, 8, n_samples)
s1 = [1101.0,1302.0,1202.0]
s2 = [2300.0,1200.0,18600.0]
s3 = [14000.0,19900.0,1700.0]
S = np.c_[s1, s2, s3]
#S += 0.2 * np.random.normal(size=S.shape)
#S /= S.std(axis=0)
print(S)
#A = np.array([[1, 1, 1], [1, 1, 1], [1, 1, 1]])
X = S
print(X)
ica = FastICA(n_components=3)
S_ = ica.fit_transform(X)
fig = plt.figure()
models = [X, S, S_]
names = ['mixtures', 'real sources', 'predicted sources']
colors = ['red', 'blue', 'orange']
for i, (name, model) in enumerate(zip(names, models)):
    plt.subplot(4, 1, i+1)
    plt.title(name)
    for sig, color in zip (model.T, colors):
        plt.plot(sig, color=color)

fig.tight_layout()
plt.show()