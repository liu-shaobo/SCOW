import { applicationJsonHeaders } from "src/utils";

import { changePassword } from "../src/changePassword";

const authUrl = "auth:5000";

const identityId = "123";

const oldPassword = "123456";

const newPassword = "654321";


interface RequstSchema {
  method: string,
  body: string,
}

// @ts-ignore
globalThis.fetch = jest.fn((url:string, req:RequstSchema) => {
  const testBody = JSON.parse(req.body);
  const testIdentityId = testBody.identityId;
  const testOldPassword = testBody.oldPassword;

  if (testIdentityId !== identityId) {
    return { status: 404, text: () => "" };
  }
  else if (testOldPassword !== oldPassword) {
    return { status: 412, text: () => "" };
  }
  else {
    return { status: 204, text: () => "" };
  }
});

it("raises correct request for changing password", async () => {
  await changePassword(authUrl, { identityId, oldPassword, newPassword });

  expect(fetch).toHaveBeenCalledWith(
    authUrl + "/password",
    {
      method: "PATCH",
      body: JSON.stringify({ identityId, oldPassword, newPassword }),
      headers: applicationJsonHeaders,
    },
  );
});

it("fails test for changing password with wrong oldpassword", async () => {

  try {
    await changePassword(authUrl, { identityId, oldPassword: oldPassword + "123", newPassword });
    expect("").fail("Change password success");
  } catch (e: any) {
    expect(e.status).toBe(412);
  }
});

it("fails test for changing password with the user who cannot be found", async () => {
  try {
    await changePassword(authUrl, { identityId: identityId + "123", oldPassword, newPassword });
    expect("").fail("Change password success");
  } catch (e: any) {
    expect(e.status).toBe(404);
  }
});

it("succeeds when changing password", async () => {
  await changePassword(authUrl, { identityId, oldPassword, newPassword });
});
