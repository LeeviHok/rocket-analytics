from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import ARRAY

from .database import Base


class FlightRecord(Base):
    __tablename__ = 'flight_records'

    id = Column(Integer, primary_key=True, index=True)
    flight_data = relationship(
        'FlightData', back_populates='flight_record', uselist=False
    )

    rocket_name = Column(String, nullable=False)
    flight_datetime = Column(DateTime(timezone=True), nullable=False)
    #flight_description = ?

    def __repr__(self):
        return self.rocket_name


class FlightData(Base):
    __tablename__ = 'flight_data'

    id = Column(Integer, primary_key=True, index=True)
    flight_record_id = Column(
        Integer, ForeignKey('flight_records.id'), unique=True, nullable=False
    )
    flight_record = relationship('FlightRecord', back_populates='flight_data')

    # Measured data from the altimeter
    time = Column(ARRAY(Numeric(9, 5)), nullable=False)                # s
    accel_axial = Column(ARRAY(Numeric(10, 7)), nullable=False)        # G
    accel_lateral = Column(ARRAY(Numeric(10, 7)), nullable=False)      # G
    pressure = Column(ARRAY(Numeric(6, 5)), nullable=False)            # atm
    current = Column(ARRAY(Numeric(5, 3)), nullable=False)             # A
    temperature = Column(ARRAY(Numeric(5, 3)), nullable=False)         # F
    velocity = Column(ARRAY(Numeric(5, 1)), nullable=False)            # ft/s
    voltage_battery = Column(ARRAY(Numeric(5, 3)), nullable=False)     # V
    voltage_pyro_apogee = Column(ARRAY(Numeric(5, 3)), nullable=False) # V
    voltage_pyro_main = Column(ARRAY(Numeric(5, 3)), nullable=False)   # V
    voltage_pyro_3 = Column(ARRAY(Numeric(5, 3)), nullable=False)      # V
    voltage_pyro_4 = Column(ARRAY(Numeric(5, 3)), nullable=False)      # V

    # Derived data from the altimeter measurements
    altitude_asl = Column(ARRAY(Numeric(9, 3)), nullable=False)        # m
    altitude_agl = Column(ARRAY(Numeric(9, 3)), nullable=False)        # m
