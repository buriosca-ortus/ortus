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
	
	public static Connection getConnection() {
		try {
			return DBContext.ds.getConnection(); 
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public static DataSource ds() {
		return DBContext.ds;
	}
}
