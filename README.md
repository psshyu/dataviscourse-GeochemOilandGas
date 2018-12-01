# U.S. Source Rock Geochemistry Visualization System
#### CS 6630 - Fall 2018
#### Pablo Napan & Skylar Shyu

### Project description and Overview:

The plan is to give our users a birds-eye/detailed view of
the U.S. source rocks geochemical data (TOC, S1, S2, etc.) by displaying the data interactively
so it facilitates geoscientists in the analysis/exploration of the data at different
scales: data point, oil well and basin-wise. 

Most tools in the oil & gas industry and academia focus on data management, not exploration nor visualization. We hope that this tool can enable both experts in the industry and the common lay-person to explore available geochemistry data for source rocks free from bias. However, without a doubt, this tool will probably be more useful to someone working in the oil & gas field, as it is costly to drill for the aforementioned resources. Thus, having a tool like this to broadly explore and perhaps compare well/basin samples will be useful to sift through the data to make good choices. 

### Features:

For this purpose we have implemented two screens:

Screen #1:

The points represent the well and outcrop locations across the U.S. from where the samples were taken; and the polygons show the
geoprovinces that contain this samples (This clasification was made by the USGS). This screen is intended to give the user a birds-eye view of
the wells/samples and their distribution with respecto to the geoprovinces/basins.

Screen #2:

This screen is intended to let the user interact with the data and explore the data that the formations contain. Please note that
the data is sparse and some formations may only have data in one or two charts. Since the data is expensive to acquire and hard to find,
any piece of information is valuable for the exploration of hydrocarbons. The data in this screen, also, may show what can be interpreted
as outliers (or data points outside the charts) by the layman user, but they lead to geological conclusions although we do not need to know
their actual values in the X and Y axes.

*The data is property of the Energy and Geoscience Institute at the University of Utah. The data values have been modified
for confidentiality purposes.


*Website URL:* https://psshyu.github.io/dataviscourse-GeochemOilandGas/

*Screencast:* https://youtu.be/4HY0Ihaf76M

### We are handing in:

- Process book (.pdf)
- Feedback Excersise (.pdf)
- /data: Contains the geospatial table for the geochemical samples and the table containing the geochemical description of those samples.
- /img: Reference images (from our design) that we use to guide our implementation.
- /js: Contains the js code for this project.
