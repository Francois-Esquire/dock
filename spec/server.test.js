import test from "ava";
import request from "supertest";
import { log } from "util";

import app from "../dist/app";
import render from "../dist/www";

const server = app.callback();

test("App: headers", async t => {
  const response = await request(server).get("/");

  const { headers } = response;

  log(headers);

  t.pass();
});

test("App: route /*", async t => {
  const path = "/";

  const response = await request(server).get(path);
  const html = await render({ path });

  t.plan(3);

  t.is(response.status, 200);
  t.is(response.type, "text/html");
  t.is(response.text, html);
});
