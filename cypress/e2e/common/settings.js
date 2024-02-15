import {Then,Given, When} from "@badeball/cypress-cucumber-preprocessor"
import {login} from "./users-login";

When(/^opening the management panel$/, function () {
    cy.get('[data-test="settings-button"]').click();
});

Given(/^an authorized technical lead$/, function () {
    cy.visit('/')
    login();
});
