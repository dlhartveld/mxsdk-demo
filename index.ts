/// <reference path="typings/tsd.d.ts" />

import { MendixSdkClient, Project } from 'mendixplatformsdk'

import rest = require('rest');

import mime = require('rest/interceptor/mime');
import errorCode = require('rest/interceptor/errorCode');
import pathPrefix = require('rest/interceptor/pathPrefix');

//
// CREDENTIALS
//

const username = '<username>';
const apikey = '<apikey from profile page>';

//
// APP
//

//const sprintrProjectId = '5509c523-e74a-4fa6-88bd-98c1c32ef531';

new MendixSdkClient(username, apikey)
    .platform()
    .createNewApp('mynewapp')
    .then(p => createSandbox(p.id()))
    .then(r => console.log(`Created sandbox: ${r.ProjectId}: ${r.AppId}: ${r.Name}: ${r.Url}`))
    .catch(e => {
        console.log('Something went wrong:');
        console.dir(e);
    })
    .done(() => console.log('Done.'))
    ;

//
// API
//

interface CreateSandboxResponse {
    AppId: string,
    Name: string,
    ProjectId: string,
    Url: string
}

function createSandbox(sprintrProjectId: string): When.Promise<CreateSandboxResponse> {
    const path = '/api/1/apps/';

    const createSandboxEntity = {
        'ProjectId': sprintrProjectId
    };

    return post(path, createSandboxEntity)
        .then(response => response.entity);
}

//
// API IMPLEMENTATION DETAILS
//

const host = 'deploy.mendix.com'
const prefix = `https://${host}`;

const authenticationHeaders = {
    'Mendix-Username': username,
    'Mendix-ApiKey': apikey
};

const client = rest
    .wrap(mime)
    .wrap(errorCode)
    .wrap(pathPrefix, { prefix: prefix })
    ;

function post(path: string, entity: any) {
    return client(
        {
            method: 'POST',
            path: path,
            headers: authenticationHeaders,
            entity: entity
        }
    );
}
