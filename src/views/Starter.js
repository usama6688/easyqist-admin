import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";
import TopCards from "../components/dashboard/TopCards";
import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import { useViewDashboardCountsQuery } from "../services/Api";

const Starter = () => {

  const {
    data: viewDashboardCounts,
    refetch: viewDashboardCountsRefetch,
  } = useViewDashboardCountsQuery();

  return (
    <div>
      {/***Top Cards***/}
      <Row>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-success text-success"
            title="Profit"
            subtitle="Today's Orders"
            earning={viewDashboardCounts?.data?.today}
            icon="bi bi-wallet"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Refunds"
            subtitle="Pending Orders"
            earning={viewDashboardCounts?.data?.pending}
            icon="bi bi-coin"
          />
        </Col>
        {/* <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-warning text-warning"
            title="New Project"
            subtitle="Documentation"
            earning={viewDashboardCounts?.data?.document}
            icon="bi bi-basket3"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Completed Orders"
            earning={viewDashboardCounts?.data?.completed}
            icon="bi bi-bag"
          />
        </Col> */}

        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Todays Accepted"
            earning={viewDashboardCounts?.data?.todayAccepted}
            icon="bi bi-bag"
          />
        </Col>

        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Total Accepted"
            earning={viewDashboardCounts?.data?.totalAccepted}
            icon="bi bi-bag"
          />
        </Col>

        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Today Delivered"
            earning={viewDashboardCounts?.data?.todayDelivered}
            icon="bi bi-bag"
          />
        </Col>

        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Total Delivered"
            earning={viewDashboardCounts?.data?.totalDelivered}
            icon="bi bi-bag"
          />
        </Col>
      </Row>
      {/***Sales & Feed***/}
      <Row>
        <Col sm="12" lg="12" xl="12" xxl="12">
          <SalesChart />
        </Col>
      </Row>
      {/***Table ***/}
      <Row>
        <Col lg="12">
          <ProjectTables />
        </Col>
      </Row>
    </div>
  );
};

export default Starter;
