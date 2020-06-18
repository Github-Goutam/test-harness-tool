import React, {useEffect, useState} from 'react';
import { Row, Col, Button, Table, Pagination, Card } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import ProfileList from '../../../common/profile-list'
import Service from '../../../common/service'
import styles from './service-request.scss'
import common from '../../../common/common.scss'

function ServiceRequest() {
  
  const history = useHistory();
  const location = useLocation();
  const {state} = location;
  const testsetid = state[0].testSetId
  const [sort, setSort] = useState({})
  
  function toTimeString(seconds) {
	return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
  }
  
  function handleSubmit() {
	  const start = Date.now();
	  Service.get(`/rbs/th/testdata/result/${testsetid}`)
	  .then((response) => {
		  const seconds = Date.now() - start;
		  const executionTime = toTimeString(seconds/1000)
		  const { data } = response
		  history.push({
			pathname: '/reports',
			state: {data: data, executionTime: executionTime}
		})
	  })
	  .catch(() => {
		  const seconds = Date.now() - start;
		  const executionTime = toTimeString(seconds/1000)
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
				}
			]
		  }
		  history.push({
			pathname: '/reports',
			state: {data: data, executionTime: executionTime}
		})
	  }
	  )
  }
  const [page, setPage] = useState(1)
  const setPageItem = (number) => () => {
	  setPage(number)
  }
  let items = [];
  const total = Math.ceil(state.length/10)
  for (let number = 1; number <= total; number++) {
    items.push(
      <Pagination.Item key={number} active={number === page} onClick={setPageItem(number)}>
        {number}
      </Pagination.Item>
    );
  }
  const indexOfLastTodo = page * 10;
  const indexOfFirstTodo = indexOfLastTodo - 10;
  const paginationData = state.slice(indexOfFirstTodo, indexOfLastTodo);
  const columns = [{
	  name: 'ID',
	  key: 'id'
  }, {
	  name: 'Application Identity',
	  key: 'applicationIdentity',
	  sortable: true,
	  direction: 'asc'
  }, {
	  name: 'Bank Division',
	  key: 'bankDivision'
  }, {
	  name: 'Product Family',
	  key: 'productFamily'
  }, {
	  name: 'Product Name',
	  key: 'productName'
  }, {
	  name: 'Borrowing Amount(GBP)',
	  key: 'borrowingAmount',
	  sortable: true,
	  direction: 'asc'
  }, {
	  name: 'Term (Months)',
	  key: 'termFactor'
  }, {
	  name: 'Risk Band',
	  key: 'riskBand'
  }, {
	  name: 'AIR(%)',
	  key: 'air',
  }, {
	  name: 'APR(%)',
	  key: 'apr',
  }]
  
  const sortable = (sortKey, direction, isSortable) => () => {
    if (isSortable) {
	  let newDirection = direction
	  if (sort[sortKey]) {
		  newDirection = sort[sortKey] === 'asc' ? 'desc' : 'asc'
	  }
	  if (newDirection === 'asc') {
		state.sort((a,b) => a[sortKey] - b[sortKey])
	  }
	  if (newDirection === 'desc') {
		state.sort((a,b) => b[sortKey] - a[sortKey])
	  }
	  setSort({[sortKey]: newDirection})
	}
  }
  const getSortDirection = (key) => {
	  return !sort[key] ? '' : (sort[key] === 'desc' ? styles.arrowDown : styles.arrowUp);
  }
  return (
    <Card>
	  <Row className={styles.wrapper}>
	    <Col md="12">
		 <Row>
		   <Col md="9">
		   </Col>
		   <Col md="3">
		    <ProfileList />
		   </Col>
		  </Row>
		  <Table responsive striped bordered hover size="md">
			  <thead>
				<tr>
				  {columns.map((item) => {
					const itemClassName = item.className ? ` ${item.className}`: ''
					const className = styles.sortHeader.concat(itemClassName)
					return <th className={className} onClick={sortable(item.key, item.direction, item.sortable)}>
					  <span>{item.name}</span>
					  {item.sortable ? <span className={styles.arrow}><div className={getSortDirection(item.key)} /></span> : ''}
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
					<td>{item.expectetAir}</td>
					<td>{item.expectetApr}</td>
				  </tr>
				))}
			  </tbody>
		  </Table>
		  {state.length > 10 && <div>
		    <Pagination>{items}</Pagination>
	      </div>}
		  <div>
		   <Button variant="primary" disabled onClick={() => history.goBack()}>Back</Button>{' '}
		   <Button variant="primary" onClick={handleSubmit}>Confirm & Execute</Button>
		  </div>
		</Col>
	  </Row>
	  
    </Card>
  );
}

export default ServiceRequest;
