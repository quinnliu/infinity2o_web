import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import matchesFields from './matchesFields';
import { Layout, Row, Col, Card, Button, Icon } from 'antd';
const { Content } = Layout;

class DashboardMatches extends Component {
	renderMatches() {
		return _.map(matchesFields, match => {
			return (
				<Col
					span={8}
					style={{
						height: '50%'
					}}
				>
					<Card
						hoverable={true}
						borderded="false"
						loading={false}
						style={{
							width: '100%',
							color: this.props.colorTheme.text1Color,
							background: this.props.colorTheme.text8Color
						}}
						cover={
							<img
								style={{
									height: '300px'
								}}
								alt="example"
								src={match.profile_pic_src}
							/>
						}
					>
						<p>Name: {match.name}</p>
						<p>Learning interests: {match.learning_interests}</p>
						<p>Class interest: {match.class_interests}</p>
						<p># of hours/week free: {match.num_hrs_week_free}</p>
						<p>Resume: {match.resume}</p>
						<Row type="flex" justify="space-between" align="top">
							<Col span={10}>
								<Button
									style={{
										borderColor: this.props.colorTheme
											.keyCompliment2,
										background: this.props.colorTheme
											.keyCompliment2,
										color: this.props.colorTheme.text1Color
									}}
									//onClick={}
								>
									Swap Out
									<Icon type="swap" />
								</Button>
							</Col>
							<Col span={10}>
								<Button
									style={{
										borderColor: this.props.colorTheme.key,
										background: this.props.colorTheme.key,
										color: this.props.colorTheme.text1Color
									}}
									//onClick={}
								>
									Say Hi!
									<Icon type="message" />
								</Button>
							</Col>
						</Row>
					</Card>
				</Col>
			);
		});
	}

	render() {
		// console.log('this.props in DashboardMatches.js', this.props);
		return (
			<Content
				style={{
					textAlign: 'center',
					padding: '10% 5% 5%', // top left&right bottom
					background: this.props.colorTheme.backgroundColor
				}}
			>
				<h1 key="0" style={{ color: this.props.colorTheme.text1Color }}>
					Here are 2 matches our AI has selected for you.
				</h1>
				<h2
					key="1"
					style={{
						color: this.props.colorTheme.text2Color,
						padding: '0% 0% 5%'
					}}
				>
					Teach our AI which study partner you prefer by swapping out
					the partner you don't want.
				</h2>
				<Row type="flex" justify="space-between" align="top">
					<Col span={2} />
					{this.renderMatches()}
					<Col span={2} />
				</Row>
			</Content>
		);
	}
}

/*
So we have a state and a UI(with props).
This function gives the UI the parts of the state it will need to display.
*/
function mapStateToProps(state) {
	return {
		colorTheme: state.colorTheme
	};
}

export default connect(mapStateToProps, null)(DashboardMatches);
