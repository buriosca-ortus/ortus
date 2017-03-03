package cz.burios.data;

import java.sql.Connection;

import javax.sql.DataSource;

public class DBContext {
	
	private static DBContext instance;
	private static DataSource ds;
	
	public static DBContext instance() {
		if (instance == null) {
			instance = new DBContext(); 
		}
		return instance;
	}
	
	public static void initialize(DataSource ds) {
		DBContext.ds = ds;
	}
	
	public static Connection getConnection() throws Exception {
		return DBContext.ds.getConnection(); 
	}
	
	public static DataSource ds() {
		return DBContext.ds;
	}
}
