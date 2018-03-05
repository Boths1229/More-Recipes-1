import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-preloading-component';
import lodash from 'lodash';
import Header from '../common/authHeader';
import Footer from '../common/footer';
import img from '../../public/images/user.png';
import verifyUser from '../../util/Authentication';
import {
  getUserRecipes,
  getUserFavRecipes,
  getUserProfile,
} from '../../actionsCreator/recipes';


const propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string
  }).isRequired,
  actions: PropTypes.shape({
    getUserFavRecipes: PropTypes.func,
    getUserRecipes: PropTypes.func,
    getUserProfile: PropTypes.func
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  myRecipesCount: PropTypes.number,
  favRecipesCount: PropTypes.number,
  profile: PropTypes.shape({
    email: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired
};

const defaultProps = {
  myRecipesCount: null,
  favRecipesCount: null,
};

/**
 * @description A class to mount the profile page
 * @extends Component
 */
class ProfilePage extends Component {
  /**
   * @description performs an action right after the component mount
   *
   * @memberof ProfilePage
   *
   * @returns {void}
  */
  componentDidMount() {
    const {
      actions
    } = this.props;
    if (verifyUser() === true) {
      actions.getUserRecipes(this.props.user.id, 0);
      actions.getUserFavRecipes(this.props.user.id);
      actions.getUserProfile(this.props.user.id);
    }
  }


  /**
   * @description renders the components
   *
   * @memberof ProfilePage
   *
   * @returns {JSX} returns the components
  */
  render() {
    const {
      user,
      isLoading,
      profile,
      myRecipesCount,
      favRecipesCount
    } = this.props;
    return (
      <div>
        <Header user={user} />
        {
          isLoading || lodash.isEmpty(profile)
            ?
              <div style={{
                marginTop: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              >
                <Spinner />
              </div>
            :
              <div className="container recipe-details">
                <section className="row">
                  <div className="col-sm-2" />
                  <div className="col-sm-8">
                    <div id="profile-card" className="card w-100" style={{ width: '20rem' }}>
                      <div className="row pb-3 centered" style={{ marginTop: '10px' }}>
                        <div className="col-sm-12" >
                          <img clasName="img-fluid rounded-circle" src={img} alt="profile" />
                          <h3 className="card-title">{user.username}</h3>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="row">
                            <div className="col-sm-12">
                              <h5>
                                Email: <span>{profile.email}</span>
                              </h5>
                            </div>
                            <div className="col-sm-12">
                              <h5>
                                Recipe Added: <span>{myRecipesCount}</span>
                              </h5>
                            </div>
                            <div className="col-sm-12">
                              <h5>
                                Favorite Recipes: <span>{favRecipesCount}</span>
                              </h5>
                            </div>
                            <div className="col-sm-12">
                              <h5>
                                Date Created: <span>{profile.createdAt.split('T')[0]}</span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                </section>
              </div>
        }

        <Footer />
      </div>
    );
  }
}

/**
 * @description maps state to properties of profilePage
 *
 * @param  {object} state
 *
 * @returns {object} returns the state to be mapped to props
 */
function mapStateToProps(state) {
  return {
    user: state.auth.user,
    favRecipesCount: state.recipes.favoriteRecipeCount,
    myRecipesCount: state.recipes.userRecipesCount,
    profile: state.auth.profile,
    isLoading: state.auth.isLoading
  };
}

/**
 * @description maps action to properties of MyFavoriteRecipePage
 *
 * @param  {object} dispatch
 *
 * @returns {object} returns the action to be bind
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getUserRecipes,
      getUserFavRecipes,
      getUserProfile
    }, dispatch)
  };
}

ProfilePage.propTypes = propTypes;
ProfilePage.defaultProps = defaultProps;


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);