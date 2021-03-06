import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getHue} from '../store/singleHue'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import {addToCart} from '../store/order'
import {me} from '../store'

class SingleHue extends React.Component {
  constructor() {
    super()
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }
  componentDidMount() {
    this.props.getHue(this.props.match.params.hueId)
  }

  handleAddToCart(hue) {
    if (this.props.isLoggedIn) {
      this.props.addToCart(hue)
    } else {
      this.guestAddToCart(hue.id, hue)
    }
  }

  // add a function that will add a hue onto localstorage when the "add to cart" button is clicked (only if the user is not logged in)

  guestAddToCart(hueId, hue) {
    // json.stringify method takes in an array/object, and setItem takes in two parameters - a key and a value. the value will be an array.
    let localOrder = localStorage.getItem('order')
    let localOrderItems = localStorage.getItem('orderItems')
    let order = []
    let orderItems = []

    // check to see if there are already items in the cart, or if this is a fresh cart.
    if (localOrder) {
      // if there are items in the cart already, move the items from the existing order into the order that we are going to push into our local storage
      order = [...JSON.parse(localOrder)]
      orderItems = [...JSON.parse(localOrderItems)]
    }
    order.push(hueId)
    orderItems.push(hue)

    window.localStorage.setItem('order', JSON.stringify(order))
    window.localStorage.setItem('orderItems', JSON.stringify(orderItems))
    console.log(window.localStorage.getItem('order'))
  }

  render() {
    const hue = this.props.hue
    return (
      <Container className="mt-5 mb-5">
        <Row className="d-flex justify-content-center">
          <Col className="lg-10">
            <Card>
              <Row>
                <Col className="md-6">
                  <div className="images p-3">
                    <div className="text-center p-4">
                      <Card.Img id="main-image" src={hue.image} width="250" />
                    </div>
                  </div>
                </Col>
                <Col className="md-6">
                  <div className="product p-4">
                    <div className="d-flex justify-content-between align-items-end">
                      <div className="d-flex align-items-center">
                        <Link to="/">
                          <Button variant="outline-secondary">
                            <i className="bi bi-arrow-left" />
                            <span className="ml-1">Back</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 mb-3">
                      <Card.Text className="text-uppercase text-muted brand">
                        {hue.emotionHue}
                      </Card.Text>
                      <Card.Title className="text-uppercase">
                        {hue.emotionName}
                      </Card.Title>
                      <div className="price d-flex flex-row align-items-center">
                        <Card.Text className="act-price">
                          ${hue.price / 100}
                        </Card.Text>
                      </div>
                    </div>
                    <Card.Text className="about">{hue.description}</Card.Text>
                    <div className="cart mt-4 align-items-center">
                      <Container className="m-1">
                        <Button
                          variant="outline-secondary"
                          className="text-uppercase mr-2 px-4"
                          onClick={() => {
                            this.handleAddToCart(hue)
                            alert('added to cart! :)')
                          }}
                        >
                          Add to cart
                        </Button>
                        <Button variant="outline-danger" className="m-1">
                          <i className="bi bi-heart text-red" />
                        </Button>
                        <Button variant="outline-dark">
                          <i className="bi bi-share text-dark" />
                        </Button>
                      </Container>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    hue: state.hue,
    isLoggedIn: !!state.user.id
  }
}

const mapDispatchToProps = dispatch => ({
  getHue: id => dispatch(getHue(id)),
  addToCart: hue => dispatch(addToCart(hue)),
  loadUser: () => dispatch(me())
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleHue)
