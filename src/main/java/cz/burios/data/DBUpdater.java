package cz.burios.data;

import java.sql.Connection;
import java.sql.Statement;

public class DBUpdater {
	
	protected DBContext db;
	
	public DBUpdater(DBContext db) {
		this.db = db;
	}
	
	public void structureUpdate() throws Exception {
		try (Connection conn = DBContext.getConnection()) {
			try (Statement stmt = conn.createStatement()) {
				stmt.execute(
					"CREATE TABLE user_login (" + 
						"ID VARCHAR(20) NOT NULL," + 
						"USER_NAME VARCHAR(50) NOT NULL," + 
						"USER_PASSWORD VARCHAR(32) NOT NULL," + 
						"CREATE_DATE DATE" + 
						"PRIMARY KEY (ID)" + 
					")"
				);
			}
		}
	}
}
