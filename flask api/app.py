from flask import Flask, render_template, redirect, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_restful import Resource, Api
import os
import json
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData

app = Flask(__name__)
api = Api(app)

dbname = 'MetaDBExtractor.db'
mongo_dbname = "Meta_DB_Extractor"

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, dbname)
sqldb = SQLAlchemy(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/Meta_DB_Extractor"
mongo = PyMongo(app)

class Extract_MongoDB_Meta_Table(Resource):
    def get(self):
        dbname = "Meta_DB_Extractor"
        tablename = "Latest_Stock_Data"

        row_one = mongo.db.all_data.find()
        print(row_one[0])

        field_list = []
        total_field_data = []

        meta_data = {
            dbname : total_field_data
        }

        # Parsing the document for fields extraction
        for field_name, field_value in row_one[0].items():
            field_list.append(field_name)
            total_field_data.append(
                {
                    "Col_name" : field_name,
                    "Data_type" : f"{type(field_value)}",
                    "Tab_name" : tablename,
                }
            )
        
        # Storing meta data at class level
        self.meta_data = meta_data

    def __repr__(self):
        return f"Meta Data of the mongo db is as follows:\n{self.meta_data}"

class Extract_SQLite_Meta_Table(Resource):
    def get(self, data_input):
        meta_data_dict = {}
        # dbname = data_input
        tablename = data_input
        engine = create_engine('sqlite:///' + os.path.join(basedir, dbname)).connect()
        md = MetaData()
        md.reflect(bind=engine)
        k = []
        for table in reversed(md.sorted_tables):
            k.append(table)
        all_columns_info = []
        for element in k:
            print(element)
            if f"{element}" == tablename:
                all_columns_info = []
                for col in element.columns:
                    all_columns_info.append({
                        "Column Name" : col.name,
                        "Column Type" : col.type,
                        "Table Name"  : element.name
                    })
                meta_data_dict[element.name] = all_columns_info
        return f"{meta_data_dict}"

class Extract_MongoDB_Meta_DB(Resource):
    def get(self):
        tablename = "Latest_Stock_Data"
        row_one = mongo.db.all_data.find()
        print(row_one[0])

        field_list = []
        total_field_data = []

        meta_data = {
            mongo_dbname : total_field_data
        }

        # Parsing the document for fields extraction
        for field_name, field_value in row_one[0].items():
            field_list.append(field_name)
            total_field_data.append(
                {
                    "Col_name" : field_name,
                    "Data_type" : f"{type(field_value)}",
                    "Tab_name" : tablename,
                }
            )
        
        # Storing meta data at class level
        self.meta_data = meta_data

    def __repr__(self):
        return f"Meta Data of the mongo db is as follows:\n{self.meta_data}"

class Extract_SQLite_Meta_DB(Resource):
    def get(self, data_input):
        meta_data_dict = {}
        dbname = data_input
        engine = create_engine('sqlite:///' + os.path.join(basedir, dbname)).connect()
        md = MetaData()
        md.reflect(bind=engine)
        k = []
        for table in reversed(md.sorted_tables):
            k.append(table)
        all_columns_info = []
        for element in k:
            all_columns_info = []
            for col in element.columns:
                all_columns_info.append({
                    "Column Name" : col.name,
                    "Column Type" : col.type,
                    "Table Name"  : element.name
                })
            meta_data_dict[element.name] = all_columns_info
        return f"{meta_data_dict}"

class Get_Default_DB(Resource):
    def get(self):
        return f"{dbname}"

api.add_resource(Extract_MongoDB_Meta_Table, '/Extract_MongoDB_Meta_Table')
api.add_resource(Extract_SQLite_Meta_Table, '/Extract_SQLite_Meta_Table/<string:data_input>')
api.add_resource(Extract_MongoDB_Meta_DB, '/Extract_MongoDB_Meta_DB')
api.add_resource(Extract_SQLite_Meta_DB, '/Extract_SQLite_Meta_DB/<string:data_input>')
api.add_resource(Get_Default_DB, '/Get_Default_DB')


if __name__ == '__main__':
    # sqldb.create_all()
    app.run(debug=True)