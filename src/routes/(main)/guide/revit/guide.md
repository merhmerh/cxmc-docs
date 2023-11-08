# Revit IFC-SG Guide

## Preface

This guide is tailored for Revit 2023 and provides step-by-step instructions for setting up IFC-SG parameters in your Revit project.

Parameter and Properties are interchangeable term.

## Setting up Parameters

### Using Revit BIM Interoperability Tools

#### Requirements

1. **Download the XML Configuration File:** Start by downloading the XML configuration file from [this link](https://cx.builtsearch.com/downloads).

2. **Install BIM Interoperability Tools:** You can obtain BIM Interoperability Tools from either [manage.autodesk.com](https://manage.autodesk.com/) or the [Autodesk desktop app](https://www.autodesk.com/desktop-app).

#### Setup

1. **Access Interoperability Tools:** After installation, open Revit and navigate to the Revit banner. Choose `Interoperability Tools` and click `Run` in the Shared Parameter Panel.

2. **Import Configuration:** Click on `...` to browse and select the downloaded XML configuration file. Then, choose `Update`.

3. **Parameter Import:** A prompt will confirm the successful import of parameters. This process will automatically populate all IFC-SG parameters into your project.

_An error stating parameter where not valid and could not be bound for IfcObjectType is expected, you can ignore this warning._

<video width="600" controls>
  <source src="/static/guide/BIT.mp4" type="video/mp4">
</video>

### Using Shared Parameters

If you do not have access to BIM Interoperability Tools, you can manually insert IFC-SG parameters using shared parameters. Follow these steps:

1. **Download Shared Parameters File:** Download the shared parameters file from [this link](https://cx.builtsearch.com/downloads).

2. **Access Shared Parameters in Revit:** In Revit, select the `Manage` banner and choose `Shared Parameters`.

3. **Edit Shared Parameter Settings:** In the `Edit Shared Parameter` window, browse and select the downloaded shared parameter file. You will see a list of IFC-SG parameters. Click `OK` to proceed.

4. **Define Project Parameters:** In the same ribbon panel, select `Project Parameters`. Then, click the `New Parameter` button. Choose the `Shared Parameter` radio button and click `Select`.

5. **Parameter Configuration:** Choose a parameter, set `Group parameter under` to 'IFC Parameters', and select the relevant Revit categories to
   insert the parameter. Repeat this step for all desired parameters.

## Adding IFC Identifier

To identify an element in IFC, it uses 3 parameters:

-   IfcEntity
-   PredefinedType
-   ObjectType (situational)

**IfcEntity** represents the high-level category to which a building component belongs. It always starts with "Ifc..." (e.g., IfcWall, IfcDoor, ...).

**PredefinedType** values are predefined by IFC standards and explain the type of component.

**ObjectType** is used in situations where IFC-SG needs to expand the types of building components. When ObjectType is used, set the PredefinedType value as 'USERDEFINED.'

#### Revit 2023 Onwards

For Revit version 2023 and later, you can select IfcEntity and PredefinedType via the `Export to IFC as` parameter value under the 'IFC parameters' section in the properties panel.

ObjectType is entered similarly to a typical parameter. (This should only be used when PredefinedType is 'USERDEFINED')

#### Revit 2022 and Earlier

In versions prior to Revit 2023, you must create the parameters `IfcExportAs` and `IfcObjectType` in the project parameters.

IfcEntity and its PredefinedType are entered using `IfcExportAs` following this syntax:

```
IfcEntity.PREDEFINEDTYPE
```

Example:

-   **Parapet wall:** IfcEntity: `IfcWall.PARAPET`
-   **AREA GFA:** IfcEntity: `IfcSpace.USERDEFINED`, IfcObjectType: `AREA_GFA`

#### Manipulating Ifc Export

By default, Revit has assigned specific IfcEntities to each category of element, such as Wall to IfcWall and Floor to IfcSlab.

You have the option to override these assignments by specifying the IFC Export value.

For example, if you were to model a ramp using the Floor category, it would typically be exported as IfcSlab by default. To change this behavior, you can set the `Export to IFC As` parameter to IfcRamp.

## Inserting Parameters

Once your parameters are set up, you can select one or multiple elements and change the value of the parameter in the properties panel.

### Using BIM Interoperability Tools (Assign Picklist)

(Currently only applicable for SpaceName, OccupancyType, and AGF_Name)

1. **Download Database File:** Download the Assign Picklist file from [this link](https://cx.builtsearch.com/downloads).

2. **Import Database:** Click on `...` to browse and select the downloaded XLSX database file. Then, select `OK.` Click `Load` to load the database.

3. **Insert Parameter:** Select one or multiple elements. In the Picklist Window, choose the parameter name to list all possible values. Select a value and click `Assign` to assign it to the parameter.

_Note: Parameters with a value cannot be reassigned._

This guide provides clear instructions for setting up and inserting IFC

## Exporting IFC

#### Requirements

**Download Configuration File:** Downloading IFC Exporter .json file and Revit Ifc Mapping Table .txt file [here](https://cx.builtsearch.com/downloads).

#### Export

To export your model to the IFC-SG standard, you'll need to configure a few settings in Revit. Follow these steps:

1. In Revit, Navigate to the IFC Exporter Window from `File` -> `Export` -> `IFC`.

2. Within the IFC exporter window, Click on `Modify Setup ...` button.

3. In the Modify Setup window, select the icon for `Import Setup...` and select the IFC Configuration .json file.

4. Next, go to the `Property Sets` tab within the "Modify Setup" window. Under the section labeled 'Export user-defined property sets', click on the "Browse" button and select the IFC-SG Mapping Table .txt file.

5. You can leave all other settings at their default values. Click the "OK" button to confirm the setup. Back in the Export Ifc Window, click on the `Export` button to initiate the export process for your model.

Please note that exporting large files may take a significant amount of time, be prepared for a potentially lengthy export process.

## Referencing

When inserting any values, it is advised to refer to [IFC-SG documentation](https://cx.builtsearch.com/ifcsg) and copy-paste the value to avoid typo.
