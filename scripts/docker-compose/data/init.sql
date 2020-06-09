/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
CREATE TABLE IF NOT EXISTS profiles(
      profile_name varchar(40),
      activation varchar(20),
      amt_password varchar(40),
      configuration_script text,
      generate_random_password BOOLEAN,
      random_password_characters varchar(100),
      random_password_length integer,
      creation_date timestamp,
      created_by varchar(40),
      CONSTRAINT name UNIQUE(profile_name)
    );
CREATE TABLE IF NOT EXISTS domains(
      name varchar(40),
      domain_suffix varchar(40),
      provisioning_cert text,
      provisioning_cert_storage_format varchar(40),
      provisioning_cert_key text,
      creation_date timestamp,
      created_by varchar(40),
      CONSTRAINT domainname UNIQUE(name)
    );