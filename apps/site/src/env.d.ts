declare namespace App {
  interface Locals {
    /** Set by the middleware when visitors are shown the under construction page. */
    underConstruction?: { message: string };
  }
}
