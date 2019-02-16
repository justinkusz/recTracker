import expect from "expect";

import reducer from "../../reducers/RecsReducer";
import * as types from "../../actions/types";

describe("recs reducer", () => {
  it("should return the initial state", () => {
    const initial = {
      recs: [],
      filter: {
        query: "",
        consumed: false
      },
      error: null,
      loading: false,
      updatingRec: null,
      alert: null
    };

    expect(reducer(undefined, {})).toEqual(initial);
  });

  it("should set loading=true", () => {
    expect(
      reducer(undefined, { type: types.RECS_FETCH_STARTED })
    ).toMatchObject({
      loading: true
    });

    expect(reducer(undefined, { type: types.REC_ADD_ATTEMPTED })).toMatchObject(
      {
        loading: true
      }
    );
  });

  it("should set loading=false and update recs and filteredRecs", () => {
    const action = {
      type: types.RECS_FETCHED,
      payload: [{ data: "rec1" }, { data: "rec2" }]
    };

    expect(reducer(undefined, action)).toMatchObject({
      recs: action.payload,
      filteredRecs: action.payload,
      loading: false
    });
  });

  it("should set loading=false and update error", () => {
    const actions = [
      { type: types.RECS_FETCH_ERROR, payload: "error" },
      { type: types.REC_ADD_ERROR, payload: "error" },
      { type: types.REC_UPDATE_ERROR, payload: "error" },
      { type: types.REMOVE_REC_FAILED, payload: "error" }
    ];

    actions.forEach(action => {
      expect(reducer(undefined, action)).toMatchObject({
        loading: false,
        error: action.payload
      });
    });
  });

  it("should set error=null and update alert", () => {
    const action = {
      type: types.REC_ADD_SUCCESS,
      payload: {
        title: "Dummy"
      }
    };

    expect(reducer(undefined, action)).toMatchObject({
      error: null,
      alert: {
        type: "success",
        action: "add_rec",
        rec: action.payload,
        message: "Added recommendation: Dummy"
      }
    });
  });

  it("should update the specific rec in the recs array", () => {
    const recs = [{ _id: 0, title: "zero" }, { _id: 1, title: "one" }];

    const updated = { _id: 1, title: "updated" };

    const action = {
      type: types.REC_UPDATE_SUCCESS,
      payload: updated
    };

    expect(reducer({ recs }, action)).toMatchObject({
      recs: [recs[0], updated]
    });
  });

  it("should update alert and remove specific rec from recs array", () => {
    const recs = [{ _id: 0, title: "zero" }, { _id: 1, title: "one" }];

    const action = {
      type: types.REMOVE_REC_SUCCESS,
      payload: recs[0]
    };

    expect(reducer({ recs }, action)).toMatchObject({
      alert: {
        type: "success",
        action: "remove_rec",
        rec: action.payload,
        message: `Removed recommendation: "${action.payload.title}"`
      },
      recs: [recs[1]]
    });
  });

  it("should update the recs filter", () => {
    const action = {
      type: types.REC_FILTER_CHANGED,
      payload: {
        consumed: true
      }
    };

    expect(reducer(undefined, action)).toMatchObject({
      filter: action.payload
    });
  });
});
