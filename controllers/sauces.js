const sauces = require("../models/sauces");
const express = require("express");

function getSauces(req, res, next) {
  const token = req.header("Authorization");
  console.log(token);
}
