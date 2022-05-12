import React, { useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Select from "../components/Select";
import { isEmpty } from "lodash";

const linkOptions = [{ value: "mdisk" }, { value: "dood" }];
export const catOptions = [
  { label: "Webseries", value: "1" },
  { label: "English", value: "2" },
  { label: "English Premium", value: "3" },
  { label: "Desi", value: "4" },
  { label: "English Bulk", value: "5" }
];

export default function DriveHelp() {
  const history = useHistory();
  const location = useLocation();
  const locationState = location?.state || {};

  const [groupId, setGroupId] = useState(locationState.groupInfo?.id || "");
  const [groupInfo, setGroupInfo] = useState(locationState.groupInfo || {});

  const [category, setCategory] = useState(locationState.category || catOptions[0].value);
  const [size, setSize] = useState(locationState.size || "50");
  const [page, setPage] = useState(locationState.page || "1");
  const [pageIncrementor, setPageIncrementor] = useState(locationState.pageIncrementor || "1");
  const [channelName, setChannelName] = useState(locationState.channelName || "primexmov");
  const [linkType, setLinkType] = useState(locationState.linkType || linkOptions[0].value);
  const [thumbActive, setThumbActive] = useState(!!locationState.thumbUrl || false);
  const [thumbUrl, setThumbUrl] = useState(
    locationState.thumbUrl || "https://drive.google.com/uc?export=view&id=1GK6SH3Kwgu-Nwr4ilQPyiKuk26tbZmxb"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async e => {
    if (e) e.preventDefault();
    if (isEmpty(groupInfo)) {
      setError("Click on get info after passing groupId");
      return false;
    }
    setLoading(true);
    const params = {
      groupInfo,
      category: category,
      size,
      page,
      channelName,
      linkType,
      pageIncrementor
    };
    if (thumbActive) {
      params.thumbUrl = thumbUrl;
    }
    console.log("sfsfsf", params);
    try {
      if (locationState._id) {
        if (params.groupInfo === locationState.groupInfo && params.groupInfo) delete params.groupInfo;
        if (params.category === locationState.category && params.category) delete params.category;
        if (params.size === locationState.size && params.size) delete params.size;
        if (params.page === locationState.page && params.page) delete params.page;
        if (params.channelName === locationState.channelName && params.channelName) delete params.channelName;
        if (params.linkType === locationState.linkType && params.linkType) delete params.linkType;
        if (params.pageIncrementor === locationState.pageIncrementor && params.pageIncrementor) delete params.pageIncrementor;
        if (thumbActive && params.thumbUrl === locationState.thumbUrl && params.thumbUrl) delete params.thumbUrl;
        if (isEmpty(params)) {
          setLoading(false);
          return;
        }
        params._id = locationState._id;
        const { data } = await axios.post("/api/v1/task/update", params);
        console.log("update response==", data);
        if (data) {
          history.push("/task");
        }
        setLoading(false);
      } else {
        const { data } = await axios.post("/api/v1/task/add", params);
        console.log("api response===", data);
        if (data) {
          history.push("/task");
        }
        setLoading(false);
      }
    } catch (error) {
      console.log("api error", error);
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="content">
        <h1>Gdrive token generator</h1>
        <form onSubmit={onSubmit}>
          <Select id="linkType" name="linkType" label="Link Type" options={linkOptions} value={linkType} onChange={setLinkType} required />
          <Select id="category" name="category" label="Category" options={catOptions} value={category} onChange={setCategory} required />
          <Input id="groupId" name="groupId" label="Group Id" value={groupId} onChange={setGroupId} required />
          <div className="d-flex" style={{ alignItems: "center" }}>
            <button
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  const { data: telegramData = {} } = await axios.get(
                    `/api/v1/task/telegramget?url=https://api.telegram.org/bot_bot_token_/getChat?chat_id=${groupId}`
                  );
                  console.log("api response===", telegramData);
                  setGroupInfo(telegramData.data.result);
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Loading..." : "Get Chat Info"}
            </button>
            <div style={{ flex: 1 }}>
              <Input id="groupName" name="groupName" value={groupInfo.title} disabled />
            </div>
          </div>

          <Input id="size" max="100" name="size" label="Size(Number of messages)" value={size} onChange={setSize} required type="number" />
          <Input id="page" name="page" label="Send Page" value={page} onChange={setPage} required type="number" />
          <Input
            id="pageIncrementor"
            name="pageIncrementor"
            label="Page Increment Factor"
            value={pageIncrementor}
            onChange={setPageIncrementor}
            required
            type="number"
          />

          <Input
            id="channelName"
            name="channelName"
            label="Channel Name(without @)"
            value={channelName}
            onChange={setChannelName}
            required
          />

          <div style={{ paddingBottom: thumbActive ? 5 : 20 }}>
            <input
              type="checkbox"
              id="thumbActive"
              name="thumbActive"
              checked={thumbActive}
              onChange={() => setThumbActive(!thumbActive)}
            />
            <label htmlFor="thumbActive">Add Thumb image to message</label>
          </div>

          {thumbActive && <Input id="thumbUrl" name="thumbUrl" label="" value={thumbUrl} onChange={setThumbUrl} />}

          {error && <div style={{ color: "red" }}>{error}</div>}
          <div
            className="d-flex"
            style={{
              justifyContent: "space-between"
            }}
          >
            <button disabled={loading} className={`btn primary${loading ? " loading" : ""}`} type="submit">
              {locationState._id ? "Update Task" : "Insert Task"}
            </button>

            {locationState._id && (
              <button
                disabled={loading}
                className="btn danger"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const params = { isDeleted: true };
                    params._id = locationState._id;
                    const { data } = await axios.post("/api/v1/task/update", params);
                    console.log("Delete response==", data);
                    if (data) {
                      history.push("/task");
                    }
                    setLoading(false);
                  } catch (error) {
                    setLoading(false);
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
