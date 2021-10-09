import React, { Component } from "react";
import Card from "../Card/Card";
import ReactApexChart from "react-apexcharts";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: [
        {
          name: this.props.name,
          data: this.props.y
        }
      ],
      chartOptions: {
        chart: {
          id: "basic-bbarar"
        },
        stroke: {
          curve: 'smooth',
        },
        dataLabels: {
          enabled: false,
        }
      },
    });
  }

  render() {
    return (
      <div
        py="1rem"
        height={{ sm: "500px" }}
        width="100%"
        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
        position="relative"
      >
        <ReactApexChart
          options={this.state.chartOptions}
          series={this.state.chartData}
          type="area"
          width="100%"
          height="100%"
        />
      </div>
    );
  }
}

export default BarChart;
