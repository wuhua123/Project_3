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

@app.route("/eq_report")
def eq_report():
    """Return earthquake data in the database"""
    results = db.session.query(Eq_100.year, Eq_100.country, \
        Eq_100.mag, Eq_100.depth, Eq_100.latitude, Eq_100.longitude)\
            .order_by(Eq_100.mag.desc())

    # Create lists from the query results
    # item_num = [ i for i in range(len(results[0]))] - cannot query id
    eq_year = [result[0] for result in results]
    country_name = [result[1] for result in results]
    earthquake_mag = [result[2] for result in results]
    earthquake_depth = [result[3] for result in results]
    latitude = [result[4] for result in results]
    longitude = [result[5] for result in results]

    # Generate jason format data
    dataset = {"year": eq_year, "country":country_name, "mag": earthquake_mag, \
        "depth":earthquake_depth, "latitude":latitude, "longitude":longitude}
    #eq_data = {"dataset": dataset} - this caused error
    return jsonify(dataset)

@app.route("/distribution_map")
def distribution_map():
    """Return nothing except to indciate what will be showing up"""
    return console.log("showing distribution map")

if __name__ == '__main__':
    app.run(debug=True)
