import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql.functions import func

app = Flask(__name__)

# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/eq_100.sqlite"

db = SQLAlchemy(app)


# Create our database model
class Eq_100(db.Model):
    __tablename__ = '100years'

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.INTEGER)
    country = db.Column(db.TEXT)
    latitude = db.Column(db.TEXT)
    longitude = db.Column(db.TEXT)
    mag = db.Column(db.REAL)
    depth = db.Column(db.REAL)

    def __repr__(self):
        return '<Eq_100 %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()


@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/country_chart")
def country_chart_data():
    """Return country name and counts of earthquake in last 100 years"""

    # Query for earthquake counts by each country
    query_statement = db.session.query
    results = db.session.query(Eq_100.country, func.count(Eq_100.country)).group_by(Eq_100.country)

    # Create lists from the query results
    country_name = [result[0] for result in results]
    earthquake_count = [int(result[1]) for result in results]

    # Generate the plot trace
    trace = {
        "x": country_name,
        "y": earthquake_count,
        "type": "bar"
    }
    return jsonify(trace)

@app.route("/distribution_map")
def distribution_map():
    """Return nothing except to indciate what will be showing up"""
    return console.log("showing distribution map")

if __name__ == '__main__':
    app.run(debug=True)
