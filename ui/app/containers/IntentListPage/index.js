import React from 'react';
import Helmet from 'react-helmet';
import {
  Input,
  Row,
  Col,
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton/index';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import Header from '../../components/Header';
import IntentsTable from '../../components/IntentsTable/index';
import Preloader from '../../components/Preloader';

import {
  loadAgentDomains,
  loadDomainIntents,
  resetAgentDomains,
  resetDomainIntents,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectDomainIntents,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import messages from './messages';

export class IntentListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onSelectDomain = this.onSelectDomain.bind(this);
    this.renderAgentSelectOptions = this.renderAgentSelectOptions.bind(this);
    this.renderDomainSelectOptions = this.renderDomainSelectOptions.bind(this);
    this.onCreateAction = this.onCreateAction.bind(this);
  }

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onComponentWillMount(currentAgent);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.currentAgent !== this.props.currentAgent) {
      this.props.onComponentWillUpdate(nextProps.currentAgent);
    }
  }

  onSelectDomain(evt) {
    const value = evt.target.value;
    if (value !== 'default') {
      this.props.onChangeDomain({ value, field: 'domain' });
    }
  }

  onCreateAction() {
    this.props.onChangeUrl('/intents/create');
  }

  renderAgentSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  renderDomainSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  render() {
    const { loading, error, agentDomains, domainIntents, currentAgent } = this.props;
    const domainProps = {
      loading,
      error,
      agentDomains,
    };

    let breadcrumbs = [];
    if (currentAgent){
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`}, { label: 'Intents'},];
    }
    else {
      breadcrumbs = [{ label: 'Intents'}, ];
    }

    let domainsSelect = [];
    if (agentDomains !== false) {
      domainsSelect = agentDomains.map((domain) => ({
        value: domain.id,
        text: domain.domainName,
      }));
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain', disabled: 'disabled' });
    } else {
      domainsSelect.unshift({ value: 'default', text: 'No domains available for selected agent', disabled: 'disabled' });
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { domainProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Agent Intents"
          meta={[
            { name: 'description', content: 'Review the list of intents' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs}/>
        <Content>
          <ContentHeader title={messages.domainListTitle} subTitle={messages.domainListDescription} />
          <Form>
            <Row>
              <Input
                s={12}
                name="domain"
                type="select"
                label={messages.domain.defaultMessage}
                onChange={this.onSelectDomain}
              >
                {this.renderDomainSelectOptions(domainsSelect)}
              </Input>
            </Row>
            <Row>
              <IntentsTable
                data={domainIntents || []}
                onCellChange={() => {
                }}
              />
            </Row>
            <ActionButton label={messages.actionButton} onClick={this.onCreateAction} />
            <Row>
              <p>
                {JSON.stringify(domainProps)}
              </p>
            </Row>
          </Form>


        </Content>
      </div>
    );
  }
}

IntentListPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentWillUpdate: React.PropTypes.func,
  onChangeDomain: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  onComponentWillMount: React.PropTypes.func,
  domainIntents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  agentDomains: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (agent) => {
      dispatch(loadAgentDomains(agent.id));
      dispatch(resetDomainIntents());
    },
    onComponentWillUpdate: (agent) => {
      if (agent) {
        dispatch(loadAgentDomains(agent.id));
      } else {
        dispatch(resetAgentDomains());
      }
      dispatch(resetDomainIntents());
    },
    onChangeDomain: (domain) => {
      dispatch(loadDomainIntents(domain.value));
    },
    onChangeUrl: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agentDomains: makeSelectAgentDomains(),
  domainIntents: makeSelectDomainIntents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentListPage);
