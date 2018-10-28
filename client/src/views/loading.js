import React from "react"
import { Row, Col, Spin } from "antd"

export default () => <div id="loading">
    <Row type="flex" justify="center">
        <Col xs={24} sm={18} md={12}>
            <div className="card text-center">
                <h1 className="light white">DHotel</h1>
                <p className="light white">Connecting to the blockchain. Please wait...</p>
                <Spin />
            </div>
        </Col>
    </Row>
</div>
