/// <reference types=”cypress” />
import {Given} from "@badeball/cypress-cucumber-preprocessor"

const baseUrl = Cypress.env('dhis2BaseUrl')
const username = Cypress.env('dhis2Username')
const password = Cypress.env('dhis2Password')


export function login(){
    cy.get('#server').clear().type(baseUrl)
    cy.get('#j_username').type(username)
    cy.get('#j_password').type(password)
    cy.get('[data-test="dhis2-adapter-loginsubmit"]').click()
}
Given(/^an authorized District Planning officer$/, function () {
    cy.visit('/');
   login();
});
Given('an authorized CHMT member', () => {
    cy.visit("/");
    login()
})
