/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
/**
 * configure options to be displayed inside the flyout here
 * {
 *  option: 'name identifier for the action/option',
 *  svg: path of svg to be used //optional if using font-awesome icons,
 *  icon: boolean switch to opt svg or font-awesome icon, //true --> use font-awesome
 * iconProps: {
 *  contains font-awesome icon properties like name, color, size etc
 * }
 * }
 */
export const options = [{
  iconName: 'power-off',
  iconColor: 'green',
  iconSize: 'sm',
  action: 2,
  label: 'Power Up'
}, {
  iconName: 'power-off',
  iconColor: '#cf191c',
  iconSize: 'sm',
  action: 8,
  label: 'Power Off'
},
{
  iconName: 'recycle',
  iconColor: 'green',
  iconSize: 'sm',
  action: 5,
  label: 'Power Cycle'
}, {
  iconName: 'desktop',
  iconColor: '#8034eb',
  iconSize: 'sm',
  action: 'KVM',
  label: 'KVM'
}, {
  iconName: 'terminal',
  iconColor: '#ffffff',
  iconSize: 'sm',
  action: 'sol',
  label: 'SOL'
}

];

/**
 * configure dropdown options for flyout here 
 */
export const selectOptions = [
  {
    label: 'Audit Log',
    value: 'auditLog',
    action:"auditlog"
  }, {
    label: 'Sleep',
    value: 'Sleep',
    action: 4
  }, {
    label: 'Hibernate',
    value: 'Hibernate',
    action: 7
  }, {
    label: 'Reset to BIOS',
    value: 'Reset to BIOS',
    action: 101
  }, {
    label: 'Reset',
    value: 'Reset',
    action: 10
  }, {
    label: 'Soft-Off',
    value: 'Soft-Off',
    action: 12
  }, {
    label: 'Soft Reset',
    value: 'Soft Reset',
    action: 14
  }, {
    label: 'Power Up to BIOS',
    value: 'Power Up to BIOS',
    action: 100
  }, {
    label: 'Reset to PXE',
    value: 'Reset to PXE',
    action: 400
  }, {
    label: 'Power Up to PXE',
    value: 'Power Up to PXE',
    action: 401
  }
];