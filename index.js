var express = require('express');
var router = express.Router();
var path = require('path');

var oracledb = require('oracledb');
oracledb.autoCommit = true;


/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});
router.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/properties', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'properties.html'));
});
router.get('/property', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'property.html'));
});

router.get('/getAttraction/:selectedCategory', function(req, res){
    oracledb.getConnection({
    /* 
     user: '',
     password: '',
    */
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var data = req.params.selectedCategory;
      var query = "SELECT * From attractions where Category='"+data+"' and rownum<= 9";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
              //console.log(rows);
              res.json(rows);
          }  
        });
    });
  });

router.get('/getDetail/:attr', function(req, res){
    oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var query = "SELECT * From attractions where Name='"+req.params.attr+"'";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
              //console.log(rows);
              res.json(rows);
          }  
        });
    });
  });

router.get('/getAttractions/:cat', function(req, res){
    oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var query = "SELECT * FROM (SELECT * From attractions where attractions.Category='"+req.params.cat+"' and attractions.City in (select attractions.City from attractions join hotels on attractions.City= hotels.City join restaurants on hotels.City= restaurants.City group by attractions.City having count(distinct hotels.Name) >= 6 and count(distinct restaurants.Name) >=6) ORDER BY dbms_random.value) WHERE rownum <= 9";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
              //console.log(rows);
              res.json(rows);
          }  
        });
    });
  });



router.get('/getProperty/:address', function(req, res){
    oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var data = req.params.address;
      var query = "SELECT * From attractions WHERE Address='"+data+"'";
      //  console.log(query);
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
              //console.log(rows);
              res.json(rows);
          }  
        });
    });
  });

router.get('/getRest/:address', function(req, res){
    oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var data = req.params.address;
      //console.log(data);
      //console.log(1111111111234567);
      //var query = "SELECT distinct r.*, u.distance FROM restaurants r join (SELECT Name, ABS(zip - '"+data+"') as distance FROM uscities where zip between ('"+data+"'-5) and ('"+data+"'+5)) u on r.City = u.Name where rownum <= 6 order by u.distance";
      //  console.log(query);
      var query = "SELECT * FROM (SELECT * FROM restaurants WHERE Image is not null and City = (SELECT City FROM attractions WHERE Address = '"+ data +"' and rownum = 1) ORDER BY dbms_random.value) WHERE rownum <= 6";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
              //console.log(rows);
              res.json(rows);
          }  
        });
    });
  });

router.get('/getHotel/:address', function(req, res){
    oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var data = req.params.address;
      var query = "SELECT * FROM (SELECT * FROM hotels WHERE Image is not null and City = (SELECT City FROM attractions WHERE Address = '"+ data +"' and rownum = 1) ORDER BY dbms_random.value) WHERE rownum <= 6";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
            res.json(rows);
          }  
        });
    });
  });

router.get('/getState/:targetadd', function(req, res){
  oracledb.getConnection({
  user: 'cis550travelplus',
  password: 'cis550travelplus',
  connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
  }, function(err,connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    var add = req.params.targetadd;
    var query = "(SELECT 1 AS filter, State FROM uscities WHERE INSTR('"+add+"',State) > 0 AND ROWNUM = 1) UNION (SELECT * FROM (SELECT 2 AS filter, STATE FROM uscities ORDER BY dbms_random.value) WHERE ROWNUM = 1)";
    connection.execute(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
          // console.log(rows.rows);
          state = rows.rows[0][1];
          var query1 = "SELECT * FROM (SELECT * FROM attractions WHERE  Address <> '"+add+"' AND INSTR(Address ,'"+state+"') > 0 ORDER BY rating DESC) WHERE ROWNUM <= 3";
          connection.execute(query1, function(err, rows, fields) {
            if (err) console.log(err);
            else {
              // console.log(rows);
              // console.log(rows.rows.length);
              if (rows.rows.length === 0){
                var query2 = "SELECT * FROM (SELECT * FROM attractions WHERE  Address <> '"+add+"' ORDER BY rating DESC) WHERE ROWNUM <= 3";
                connection.execute(query2, function(err, rows, fields){
                  if (err) console.log(err);
                  else{
                    console.log(rows.rows);
                    res.json(rows.rows);
                  }
                });
              }
              else {
                console.log(rows.rows);
                res.json(rows.rows);}
            }  
          });
        }  
    });
  });
});

router.get('/getrestprice/:address', function(req, res){
  oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var add = req.params.address;
      var query = "SELECT DISTINCT Price FROM Restaurants WHERE Image is not null AND City = (SELECT City FROM attractions WHERE Address = '"+ add +"' and rownum = 1) AND Price<>0 ORDER BY Price";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
            console.log(rows);
            res.json(rows.rows);
          }  
        });
    });
});

router.get('/gethotprice/:address', function(req, res){
  oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var add = req.params.address;
      var query = "SELECT MIN(Price), MAX(PRICE) FROM hotels WHERE Image is not null AND City = (SELECT City FROM attractions WHERE Address = '"+ add +"' and rownum = 1)";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
            console.log(rows.rows);
            res.json(rows.rows);
          }  
        });
    });
});


router.get('/filteredrest/:address/:restfilter', function(req, res){
  oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var add = req.params.address;
      var filter = req.params.restfilter;
      var query = "SELECT * FROM Restaurants WHERE Image is not null AND City = (SELECT City FROM attractions WHERE Address = '"+ add +"' and rownum = 1) and Price >= '"+filter+"'";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
            console.log(rows.rows);
            res.json(rows.rows);
          }  
        });
    });
});

router.get('/filteredhot/:address/:minp/:maxp', function(req, res){
  oracledb.getConnection({
    user: 'cis550travelplus',
    password: 'cis550travelplus',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST= travelplus.cd0wi8dxiad7.us-east-2.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=TPLUS)))'
    }, function(err,connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      var add = req.params.address;
      var min = req.params.minp;
      var max = req.params.maxp;
      var query = "SELECT * FROM hotels WHERE Image is not null AND City = (SELECT City FROM attractions WHERE Address = '"+ add +"' and rownum = 1) and Price >= '"+min+"' and Price <= '"+max+"'";
      connection.execute(query, function(err, rows, fields) {
          if (err) console.log(err);
          else {
            console.log(rows.rows);
            res.json(rows.rows);
          }  
        });
    });
});






module.exports = router;