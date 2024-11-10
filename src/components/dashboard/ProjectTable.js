import { Button, Card, CardBody, CardTitle, Table } from "reactstrap";
import { useGetUserQuery, useViewOrderRequestQuery } from "../../services/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { DateRangePicker } from "react-dates";
import moment from "moment/moment";
import { useSelector } from "react-redux";

const ProjectTables = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigator = useNavigate();
  const auth = useSelector((data) => data?.auth);

  const {
    data: viewOrderRequest,
    isLoading: viewOrderRequestLoading,
    refetch: viewOrderRequestRefetch,
  } = useViewOrderRequestQuery({ params: { status: 1 } });

  const {
    data: getUser,
    refetch: getUserRefetch,
  } = useGetUserQuery({ params: { start: 0, limit: 100000 } });

  useEffect(() => {
    viewOrderRequestRefetch();
    getUserRefetch();
  }, []);

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const falseFunc = () => false;

  const filterDataByDate = (data, startDate, endDate) => {
    if (!startDate || !endDate) return data;
    return data.filter(item => {
      const createdAt = moment(item.created_at);
      return createdAt.isSameOrAfter(startDate) && createdAt.isSameOrBefore(endDate);
    });
  };

  const filteredOrderRequestData = filterDataByDate(viewOrderRequest?.data || [], startDate, endDate);
  const filteredUserData = filterDataByDate(getUser?.data || [], startDate, endDate);

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Pending Orders</CardTitle>

          <Table className="no-wrap mt-3 align-middle" borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrderRequestData?.length ? filteredOrderRequestData?.map((data) => {
                return (
                  <tr className="border-top" style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (auth?.userDetail?.type != 3) {
                        navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload();
                      }
                    }}
                  >
                    <td>
                      <h6 className="mb-0 text-capitalize">{data?.users?.name}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0">{data?.users?.phone_no}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0">{data?.order_price}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0">{moment(data?.created_at).format("DD-MM-YYYY")}</h6>
                    </td>
                    <td>
                      <h6 className="mb-0">{data?.order_status == 1 ? "Pending" : data?.order_status == 2 ? "Accepted" : data?.order_status == 3 ? "Documentation" : data?.order_status == 4 ? "Out for delivery" : data?.order_status == 5 ? "Delivered" : data?.order_status == 6 ? "Rejected" : ""}</h6>
                    </td>
                  </tr>
                )
              }).reverse() :
                <>{viewOrderRequestLoading ? <td colSpan={5}>
                  <h6 className='text-center'>Loading...</h6>
                </td> : <td colSpan={5}><h6 className='text-center'>No Record Found</h6></td>}</>
              }
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <div className="mb-4 text-end">
        <span>Select Date Range: </span>
        <DateRangePicker
          isOutsideRange={falseFunc}
          startDate={startDate}
          startDateId="datepicker-start-date"
          endDate={endDate}
          endDateId="datepicker-end-date"
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={focusedInput => setFocusedInput(focusedInput)}
        />
      </div>

      <Card>
        <CardBody>
          <CardTitle tag="h5">Users</CardTitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>CNIC</th>
                <th>Created At</th>
                {auth?.userDetail?.type == 3 ? null :
                  <th>Actions</th>
                }
              </tr>
            </thead>
            <tbody>
              {filteredUserData?.map((data) => {
                return (
                  <tr className="border-top mainDiv">
                    <td>{data?.name}</td>
                    <td>{data?.phone_no}</td>
                    <td>{data?.email}</td>
                    <td>{data?.address}</td>
                    <td>{data?.cnic_number}</td>
                    <td>{moment(data?.created_at).format("DD-MM-YYYY")}</td>
                    {auth?.userDetail?.type == 3 ? null :
                      <td>
                        <div className='d-flex' style={{ alignItems: "center" }} >
                          <Button
                            style={{ marginLeft: 10 }}
                            onClick={() => { navigator(PATHS.viewUserData, { state: { data: data?.id } }); window.location.reload(); }}
                          >View</Button>
                        </div>
                      </td>
                    }
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectTables;
