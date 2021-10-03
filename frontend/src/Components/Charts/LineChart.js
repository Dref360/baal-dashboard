import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
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
          id: "basic-bar"
        },
        xaxis: {
          categories: this.props.x
        }
      },
    });
  }
  
      
  
  render() {
      return (
        <ReactApexChart
          options={this.state.chartOptions}
          series={this.state.chartData}
          type="area"
          width="100%"
          height="100%"
        />
      );
    }
  }


export default LineChart;
