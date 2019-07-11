# Release Notes

## MPS V1
MPS server migrated to typescript project from traditional node js. All the REST API interfaces are changed to new interfaces. Now, there are four end points which are categarized based on the functionality.

* /admin - for all the admin user operations like downloading mescript, root certificate, disconnected device etc.
* /amt - for all AMT operations
* /relay - for KVM operations
* /notifications - fo updating the device connections.

##Known Defects

* Under high pressure, device responds as timed out. Make sure you give 30 to 60 seconds before proceeding.

