import expect from "expect";

import reducer from "../../reducers/AuthReducer";
import * as types from "../../actions/types";

describe("auth reducer", () => {
  it("should return the initial state", () => {
    const initial = {
      error: null,
      loading: false,
      authenticated: false,
      user: null
    };

    expect(reducer(undefined, {})).toEqual(initial);

    expect(reducer(undefined, { type: types.OPENED_AUTH_PAGE })).toEqual(
      initial
    );
  });

  it("should set loading=false and authenticated=true", () => {
    expect(
      reducer(undefined, { type: types.AUTHENTICATED, payload: "user" })
    ).toEqual({
      error: null,
      loading: false,
      authenticated: true,
      user: "user"
    });
  });

  describe("signup", () => {
    it("should set loading to true when signup attempted", () => {
      expect(reducer(undefined, { type: types.SIGNUP_ATTEMPTED })).toEqual({
        error: null,
        loading: true,
        authenticated: false,
        user: null
      });
    });

    it("should set loading=false and update error when signup failed", () => {
      expect(
        reducer(undefined, {
          type: types.SIGNUP_FAILED,
          payload: "error message"
        })
      ).toEqual({
        loading: false,
        error: "error message",
        authenticated: false,
        user: null
      });
    });
  });

  describe("login", () => {
    it("should set loading=true when login attempted", () => {
      expect(reducer(undefined, { type: types.LOGIN_ATTEMPTED })).toEqual({
        error: null,
        loading: true,
        authenticated: false,
        user: null
      });
    });

    it("should set loading=false and set error when login fails", () => {
      expect(
        reducer(undefined, { type: types.LOGIN_FAILED, payload: "error" })
      ).toEqual({
        error: "error",
        loading: false,
        authenticated: false,
        user: null
      });
    });
  });

  describe("logout", () => {
    it("should set loading=true when logout attempted", () => {
      expect(reducer(undefined, { type: types.LOGOUT_ATTEMPTED })).toEqual({
        error: null,
        loading: true,
        authenticated: false,
        user: null
      });
    });

    it("should set loading=false, update error when logout failed", () => {
      const initial = reducer(undefined, {
        type: types.AUTHENTICATED,
        payload: "user"
      });

      const updated = reducer(initial, {
        type: types.LOGOUT_FAILED,
        payload: "error"
      });

      expect(updated).toEqual({
        loading: false,
        error: "error",
        authenticated: true,
        user: "user"
      });
    });

    it("should return initial state when logout succeeds", () => {
      expect(reducer(undefined, { type: types.LOGOUT_SUCCESS })).toEqual({
        error: null,
        loading: false,
        authenticated: false,
        user: null
      });
    });
  });
});
