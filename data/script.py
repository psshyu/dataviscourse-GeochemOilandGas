#Create

import pandas as pd


geochem = pd.read_csv('SRCPhase2GeochemUSA2.csv', low_memory=False)

columns = ['OBJECTID', 'USGS_province', 'SRCLocationID', 'SRCSampleID', 'Stratigraphic_Period']

print geochem.head()

geochem_basins = geochem.USGS_province.unique()



for basin in geochem_basins:
    uniqueForm = geochem.Formation_Name.unique()

print len(uniqueForm)