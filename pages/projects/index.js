import React from 'react';
import { Flex, Box } from 'grid-styled';
import { Container } from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'next/link';
import PropTypes from 'prop-types';

import RadiksActions from 'radiks/lib/redux/actions';
import {
  selectUserGroupsById,
} from 'radiks/lib/redux/selectors';

import Head from '../../components/head';
import Nav from '../../components/nav';
import { CardLink } from '../../components/card';
import Type from '../../styled/typography';
import Loading from '../../components/loading';

class Projects extends React.Component {
  static propTypes = {
    fetchUserGroups: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    projects: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.fetchUserGroups();
  }

  loading = () => (<Loading text="Fetching your projects..." />)

  projects() {
    return Object.values(this.props.projects).map(project => (
      <Box width={1 / 3} mt={4} key={project.id} mx={3}>
        <Link href={`/projects/${project.id}`} passHref>
          <CardLink>
            <Type.p my={1} p={0} textAlign="center">
              {project.attrs.name}
            </Type.p>
          </CardLink>
        </Link>
      </Box>
    ));
  }

  render() {
    return (
      <>
        <Head />
        <Nav />
        <Container>
          <Type.h1>Your Projects</Type.h1>
          {this.props.isFetching ? this.loading() : (
            <Flex flexDirection="row">
              {this.projects()}
              <Box width={1 / 3} mt={4}>
                <Link href="/projects/new" passHref>
                  <CardLink>
                    <Type.p my={1} p={0} textAlign="center">
                      Add a Project
                    </Type.p>
                  </CardLink>
                </Link>
              </Box>
            </Flex>
          )}

        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  projects: selectUserGroupsById(state),
  isFetching: state.radiks.userGroups.isFetching,
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
