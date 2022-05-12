import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import orderBy from "lodash/orderBy";
import { catOptions } from "./AddTask";

const catObj = catOptions.reduce((ac, cu) => ({ ...ac, [cu.value]: cu.label }), {});
const getTimeStr = date => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
};

export default function Task() {
  const [data, setdata] = useState({});
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setfilter] = useState("");
  // ['asc', 'desc']
  const [sort, setSort] = useState({ by: "", order: "asc" });

  const { tasks: allTask = [] } = data;
  const filterTasks = filter ? allTask.filter(e => e.linkType === filter) : allTask;
  const tasks = orderBy(filterTasks, sort.by, sort.order);

  const handleSort = col => {
    const temp = sort.by === col && sort.order === "asc" ? "desc" : "asc";
    setSort({ by: col, order: temp });
  };

  const getData = async () => {
    const { data: resData = {} } = await axios.get("/api/v1/task/list");
    setdata(resData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main>
      <div className="content">
        <div className="d-flex">
          <div className="d-flex flex-1">
            <h1>Tasks List</h1>
            <button style={{ marginLeft: 20 }} className="danger" onClick={getData}>
              Refresh
            </button>
          </div>
          {!!selectedItems.length && (
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const { data } = await axios.post(
                    "/api/v1/task/start",
                    tasks.filter(e => selectedItems.includes(e._id))
                  );
                  console.log("tasks response===", data);
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
                }
              }}
            >
              {`Send ${selectedItems.length} chats`}
            </button>
          )}
          <button onClick={() => history.push("/task/upsert")}>Add</button>
        </div>
        <div className="d-flex align-center" style={{ padding: "15px 0px" }}>
          <div>Filters: </div>
          <button
            className={filter === "mdisk" ? "" : "outline"}
            onClick={() => {
              setSelectedItems([]);
              setfilter(filter === "mdisk" ? "" : "mdisk");
            }}
          >
            Mdisk
          </button>
          <button
            className={filter === "dood" ? "" : "outline"}
            onClick={() => {
              setSelectedItems([]);
              setfilter(filter === "dood" ? "" : "dood");
            }}
          >
            Dood
          </button>
        </div>
        <table className="task">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === tasks.length}
                  onChange={e => {
                    setSelectedItems(e.target.checked ? tasks.map(e => e._id) : []);
                  }}
                />
              </th>
              <th>S.No</th>
              <th onClick={() => handleSort("groupInfo.title")}>Group Name</th>
              <th onClick={() => handleSort("category")}>Category</th>
              <th onClick={() => handleSort("size")}>Size</th>
              <th onClick={() => handleSort("page")}>Send Page</th>
              <th onClick={() => handleSort("pageIncrementor")}>Page Incrementor</th>
              <th onClick={() => handleSort("channelName")}>Channel Name</th>
              <th onClick={() => handleSort("linkType")}>link Type</th>
              <th onClick={() => handleSort("cname")}>Cname</th>
              <th onClick={() => handleSort("lastExecuted")}>Last Executed</th>
              <th onClick={() => handleSort("status")}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((el, index) => (
                <tr key={`tassk-${index}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(el._id)}
                      onChange={e => {
                        setSelectedItems(e.target.checked ? [...selectedItems, el._id] : selectedItems.filter(e => e !== el._id));
                      }}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{el.groupInfo.title}</td>
                  <td>{catObj[el.category]}</td>
                  <td>{el.size}</td>
                  <td>{el.page}</td>
                  <td>{el.pageIncrementor}</td>
                  <td>{el.channelName}</td>
                  <td>{el.linkType}</td>
                  <td>{el.cname}</td>
                  <td>{el.lastExecuted && getTimeStr(el.lastExecuted)}</td>
                  <td>
                    <>
                      {/* <button
                          disabled={loading}
                          onClick={async () => {
                            try {
                              setLoading(true);
                              const { data } = await axios.post("/api/v1/task/start", [el]);
                              console.log("start response===", data);
                              setLoading(false);
                            } catch (error) {
                              setLoading(false);
                            }
                          }}
                        >
                          Start
                        </button> */}
                      <button
                        className="btn icon-only"
                        onClick={() =>
                          history.push({
                            pathname: "/task/upsert",
                            state: el
                          })
                        }
                      >
                        Edit
                      </button>
                      <div>{el.status === "active" ? "" : el.status}</div>
                    </>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <div
            className="d-flex"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 20
            }}
          >
            <div>Loading...</div>
          </div>
        )}
      </div>
    </main>
  );
}
