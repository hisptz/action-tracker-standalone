/// <reference types=”cypress” />
import {Given} from "@badeball/cypress-cucumber-preprocessor"


Given(/^an authorized District Planning officer$/, function () {
    cy.visit('/');
});
Given('an authorized CHMT member', () => {
    cy.visit("/");
})
