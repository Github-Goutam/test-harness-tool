import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Tabs, Tab, Table, Pagination, Card, DropdownButton, Dropdown, Breadcrumb } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import ProfileList from '../common/profile-list'
import TestLog from './components/testlog';
import Service from '../common/service'
import datas from './reports.json'
import styles from './reports.scss';
import common from '../common/common.scss';

function createLogData(data) {
	const cases = []
	cases.push({ "color": "#00c21e", "cases": "Passed", "status": "Y", "count": data.passed, percent: data.passedPercent});
	cases.push({ "color": "#d81a36", "cases": "Failed", "status": "N", "count": data.failed, percent: data.failedPercent});
	return cases;
}

function ControlledTabs(props) {
  const { data, testCasesRun, testDataList } = props
  const statusList = ['Y', 'N']
  const [key, setKey] = useState(data[0].status);
  const [page, setPage] = useState({'Y': 1, 'N': 1})
  
  const filteredData = testDataList.filter(function (item) {
	return item.testTransactionFlag === key
  })
  const setPageItem = (number) => () => {
	  setPage({...page, [key]: number})
  }
  let items = [];
  const total = Math.ceil(filteredData.length/10)
  if (page[key] > 1) {
    let prev = page[key]
	items.push(<Pagination.Item onClick={setPageItem(--prev)} className={common.paginationArrow}>&lt;&lt;</Pagination.Item>)
  }
  let x = page[key] > 5 ? page[key] : 1
  for (let number = x; number <= 5; number++) {
	if (number > total ) {
		continue;
	}
	items.push(
      <Pagination.Item key={number} active={number === page[key]} onClick={setPageItem(number)}>
        {number}
      </Pagination.Item>
    );
  }
  if (total > 5) {
	let next = page[key]
	items.push(<Pagination.Item onClick={setPageItem(++next)} className={common.paginationArrow}>&gt;&gt;</Pagination.Item>)
  }
  const indexOfLastTodo = page[key] * 10;
  const indexOfFirstTodo = indexOfLastTodo - 10;
  const paginationData = filteredData.slice(indexOfFirstTodo, indexOfLastTodo);
  const firstColumns = [{
	  name: 'ID',
	  key: 'id',
	  rowSpan: 2,
  }, {
	  name: 'Application Identity',
	  key: 'applicationIdentity',
	  rowSpan: 2,
  }, {
	  name: 'Bank Division',
	  key: 'bankDivision',
	  rowSpan: 2,
  }, {
	  name: 'Product Family',
	  key: 'productFamily',
	  rowSpan: 2,
  }, {
	  name: 'Product Name',
	  key: 'productName',
	  rowSpan: 2,
  }, {
	  name: 'Borrowing Amount(GBP)',
	  key: 'borrowingAmount',
	  rowSpan: 2,
  }, {
	  name: 'Term (Months)',
	  key: 'termFactor',
	  rowSpan: 2,
  }, {
	  name: 'Risk Band',
	  key: 'riskBand',
	  rowSpan: 2,
  }]
  if (paginationData[0].productName === 'Agri Facility') {
	Array.prototype.push.apply(firstColumns, [{
	  name: 'Start Margin',
	  key: 'startMargin',
	  rowSpan: 2,
	}, {
	  name: 'Term Margin Premium',
	  key: 'termMarginPremium',
	  rowSpan: 2,
	}])
  }
  Array.prototype.push.apply(firstColumns, [{
	  name: 'Expected',
	  key: 'expected',
	  className: styles.rateHead,
	  colSpan: 2,
	}, {
	  name: 'Actual',
	  key: 'actual',
	  className: styles.actualHead,
	  colSpan: 2,
  }])
  const secondColumns = []
  if (paginationData[0].productName === 'Small Business Loan (Fixed)') {
	Array.prototype.push.apply(secondColumns, [{
	  name: 'AIR(%)',
	  key: 'air'
	}, {
	  name: 'APR(%)',
	  key: 'apr'
	}, {
	  name: 'AIR(%)',
	  key: 'air'
	}, {
	  name: 'APR(%)',
	  key: 'apr'
	}])
  }
  if (paginationData[0].productName === 'Overdraft' || paginationData[0].productName === 'Agri Facility') {
	Array.prototype.push.apply(secondColumns, [{
	  name: 'Margin Fee',
	  key: 'marginFee'
	}, {
	  name: 'Arrangement Fee',
	  key: 'arrangementFee'
	}, {
	  name: 'Margin Fee',
	  key: 'marginFee'
	}, {
	  name: 'Arrangement Fee',
	  key: 'arrangementFee'
	}])
  }
  
  return (
    <Tabs
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
	{data.map((item, index) => {
	  const percent = item.percent ? ` (${item.percent}%)` : ''
      return (<Tab key={index} eventKey={item.status} title={`${item.cases}: ${item.count}${percent}`}>
        <Table responsive striped bordered hover size="md">
		  <thead>
			<tr>
			  {firstColumns.map((item) => {
				const colSpan = item.colSpan ? { colSpan: item.colSpan } : {}
				const rowSpan = item.rowSpan ? { rowSpan: item.rowSpan } : {}
				const className = item.className ? { className: item.className } : {}
				return <th {...rowSpan} {...colSpan} {...className}>
				  {item.name}
				</th>
		      })}
			</tr>
			<tr>
			  {secondColumns.map((item2) => {
				return <th>
				  {item2.name}
				</th>
		      })}
			</tr>
		  </thead>
		  <tbody>
		  {paginationData.map((item) => (
			  <tr>
				<td>{item.testTransactionNo}</td>
				<td>{item.applicationIdentity}</td>
				<td>{item.bankDivision}</td>
				<td>{item.productFamily}</td>
				<td>{item.productName}</td>
				<td>{item.borrowingAmount}</td>
				<td>{item.termFactor}</td>
				<td>{item.riskBand}</td>
				{paginationData[0].productName === 'Agri Facility' &&
				  <>
				   <td>{item.startMargin}</td>
				   <td>{item.termMarginPremium}</td>
				   <td>{item.expectetMarginFee}</td>
				   <td>{item.expectetArrangementFee}</td>
				   <td>{item.actualMarginFee}</td>
				   <td>{item.actualArrangementFee}</td> 
			  	  </>
				}
				{paginationData[0].productName === 'Small Business Loan (Fixed)' &&
				  <>
				   <td>{item.expectetAir}</td>
				   <td>{item.expectetApr}</td>
				   <td>{item.actualAir}</td>
				   <td>{item.actualApr}</td>
			  	  </>
				}
				{paginationData[0].productName === 'Overdraft' &&
				  <>
				   <td>{item.expectetMarginFee}</td>
				   <td>{item.expectetArrangementFee}</td>
				   <td>{item.actualMarginFee}</td>
				   <td>{item.actualArrangementFee}</td>
			  	  </>
				}
			  </tr>
			))}
		  </tbody>
		  </Table>
		  {filteredData.length > 10 && <div>
		    <Pagination>{items}</Pagination>
	      </div>}
      </Tab>)
	})}
    </Tabs>
  );
}

function RoutingPage() {
  const [file, setFile] = useState('')
  const params = useParams();
  const { slug, slug1 } = params;
  let reportsData = {data: {}, executionTime: ''}
  if (!slug) { 
	const location = useLocation();
	const {state: {data, executionTime}} = location
	reportsData.data = data
	reportsData.executionTime = executionTime
  }
  const [reports, setReports] = useState(reportsData)
  if (Object.keys(reports.data).length > 0) {
	reports.data['passedPercent'] = Math.round((reports.data.passed/reports.data.totalTestCases) * 100);
	reports.data['failedPercent'] = Math.round((reports.data.failed/reports.data.totalTestCases) * 100);
  }
  
  useEffect(() => {
	if (slug) {
	  Service.get(`/rbs/th/reports/${slug}`)
		.then((response) => {
		  const { data } = response
	      setReports({...reports, data: data})
		})
		.catch((error) => {
		  const data = {
			"totalTestCases": 27,
			"passed": 24,
			"failed": 3,
			"testcasesResultList": [
			{
					"actualAir": 7.6,
					"actualApr": 0.6,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 6,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_001",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 7.2,
					"actualApr": 0.2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 7,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_002",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 1.3,
					"actualApr": 2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_003",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_004",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_005",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 7.6,
					"actualApr": 0.6,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 6,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_001",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 7.2,
					"actualApr": 0.2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 7,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_002",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 1.3,
					"actualApr": 2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_003",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_004",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_005",
					"totalRecord": 2,
					"xmlDifference": ""
				},
			{
					"actualAir": 7.6,
					"actualApr": 0.6,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 6,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_001",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 7.2,
					"actualApr": 0.2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 7,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_002",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 1.3,
					"actualApr": 2,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_003",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_004",
					"totalRecord": 2,
					"xmlDifference": ""
				},
				{
					"actualAir": 0,
					"actualApr": 0,
					"applicationIdentity": "Ulster",
					"bankDivision": "Business",
					"borrowingAmount": 100,
					"expectetAir": 12.69,
					"expectetApr": 0,
					"productFamily": "Small Business Loan",
					"productName": "Loan",
					"riskBand": 3,
					"termFactor": 2,
					"testSetId": 1,
					"testTransactionFlag": "Y",
					"testTransactionId": 2,
					"testTransactionNo": "TH_001_005",
					"totalRecord": 2,
					"xmlDifference": ""
				}
			]
		  } 
	      setReports({...reports, data: data})
		})
	}
  }, slug)
  
  return (
	<Row className={styles.container}>
	{Object.keys(reports.data).length > 0 &&
	<Col md="12">
	  <Row>
	   <Col md="9">
		<Breadcrumb>
		 <Breadcrumb.Item href="#/">Home</Breadcrumb.Item>
		 <Breadcrumb.Item active>Reports</Breadcrumb.Item>
		</Breadcrumb>
	   </Col>
	   <Col md="3">
		<ProfileList />
	   </Col>
	  </Row>
	  <Card>
	    <Card.Header className={styles.headerContainer}>
		 <div>Test Execution Summary</div>
		 <div className={common.environment}><span>Environment:</span> {slug1? slug1 : reports.data.environment}</div>
		</Card.Header>
	    <Card.Body className={styles.cardBody}>
		  <div className={styles.relative}>
		   <div className={styles.download}>
		    <DropdownButton id="dropdown-basic-button" className={styles.dropdown} title="Download Report">
			  <Dropdown.Item href={`http://localhost:8081/rbs/th/testdata/generatepdf/${reports.data.testcasesResultList[0].testSetId}`} download target="_blank">PDF</Dropdown.Item>
			  <Dropdown.Item href={`http://localhost:8081/rbs/th/testdata/generateexcel/${reports.data.testcasesResultList[0].testSetId}`} download target="_blank">Excel</Dropdown.Item>
			 </DropdownButton>
		    <Button variant="primary" disabled className={styles.dropdown}>Email Report</Button>
		    <Button variant="primary" disabled>Print</Button>
		   </div>
		 </div>
		  <div>
		    <TestLog testCasesRun={reports.data.totalTestCases} executionTime={reports.executionTime} logData={createLogData(reports.data)} />
		  </div>
		 </Card.Body>
	  </Card>
	  <div className={styles.tabWrapper}>
	   <Card>
	    <Card.Body>
	     <ControlledTabs data={createLogData(reports.data)} testCasesRun={reports.data.totalTestCases} testDataList={reports.data.testcasesResultList} />
		</Card.Body>
	   </Card>
	  </div>
	</Col>}
	</Row>
  );
}

export default RoutingPage;
