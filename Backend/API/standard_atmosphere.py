import math


class StandardAtmosphere:
    """Calculate pressure altitude according to ISO 2533-1975 draft standard.

    This class provides functionality to calculate altitude based on barometric
    pressure and air temperature. These calculations are based on ISO 2533,
    which defines characteristics of ISO Standard Atmosphere. This Standard
    Atmosphere describes how Earth's atmosphere behaves at altitudes from -2 km
    to 80 km.
    """

    # Earth's atmosphere is divided into multiple layers based on the altitude,
    # and these layers have the following characteristics:
    # - Altitude: Altitude at bottom of the layer                    (Geopotential)
    # - Temperature: Temperature at bottom of the layer              (K)
    # - Lapse rate: Temperature rate of change throughout the layer  (K / m)
    # - Pressure: Pressure at bottom of the layer                    (Pa)
    atmosphere_layers = [
        {'altitude': -2000, 'temperature': 301.15, 'lapse_rate': -0.0065, 'pressure': 127773.72973},
        {'altitude': 0,     'temperature': 288.15, 'lapse_rate': -0.0065, 'pressure': 101325      },
        {'altitude': 11000, 'temperature': 216.65, 'lapse_rate': 0,       'pressure': 22632.040548},
        {'altitude': 20000, 'temperature': 216.65, 'lapse_rate': 0.001,   'pressure': 5474.8776378},
        {'altitude': 32000, 'temperature': 228.65, 'lapse_rate': 0.0028,  'pressure': 868.01583184},
        {'altitude': 47000, 'temperature': 270.65, 'lapse_rate': 0,       'pressure': 110.90578347},
        {'altitude': 51000, 'temperature': 270.65, 'lapse_rate': -0.0028, 'pressure': 66.938534672},
        {'altitude': 71000, 'temperature': 214.65, 'lapse_rate': -0.002,  'pressure': 3.9563926971},
        {'altitude': 80000, 'temperature': 196.65, 'lapse_rate': None,    'pressure': 0.8862723765},
    ]
    min_pressure = atmosphere_layers[-1]['pressure']
    max_pressure = atmosphere_layers[0]['pressure']
    sea_level_pressure = atmosphere_layers[1]['pressure']

    @classmethod
    def get_altitude_asl(cls, pressure):
        """Calculate geometric altitude from mean sea level.

        :param pressure: Pressure at altitude (atm)
        :type pressure: `int`, `float` or `decimal`
        :raises ValueError: Pressure is outside of Standard Atmosphere range
        :return: Geometric altitude from mean sea level in meters
        :rtype: `float`
        """
        p = float(pressure * cls.sea_level_pressure)

        if p < cls.min_pressure or p > cls.max_pressure:
            raise ValueError(
                f'Pressure ({p} Pa) is outside of allowed range: '
                f'({cls.min_pressure} <= p <= {cls.max_pressure}).'
            )

        # Find atmospheric layer which matches to the given pressure.
        layer = cls.atmosphere_layers[0]
        for atmosphere_layer in cls.atmosphere_layers[1:-1]:
            if p > atmosphere_layer['pressure']:
                break
            else:
                layer = atmosphere_layer

        # All values are according to the ISO 2533:1975 draft standard. This
        # standard specifies slightly different value for the universal gas
        # constant (R_u) than what calculating it from Avogadro and Boltzmann
        # constants would result into. But this difference is relatively small
        # and value from the standard is used for consistency.
        H_b = layer['altitude']     # Geopotential altitude at bottom of the layer  m
        T_b = layer['temperature']  # Temperature at bottom of the layer            K
        p_b = layer['pressure']     # Pressure at bottom of the layer               Pa
        B   = layer['lapse_rate']   # Temperature lapse rate                        K / m
        M_a = 0.028964420           # Molar mass of dry air                         kg / mol
        R_u = 8.31432               # Universal gas constant                        J / (K * mol)
        R_s = R_u / M_a             # Specific gas constant of dry air              J / (kg * K)
        g_n = 9.80665               # Standard acceleration of free fall            m / s^2

        # Atmosphere has multiple layers and the temperature lapse rate
        # generally varies between the layers. Few layers have temperature
        # lapse rate of 0, and these layers use different equation for the
        # pressure altitude calculation. Hence the conditional equation
        # selection based on the lapse rate.
        if B == 0:
            return cls.geopotential_to_geometric_altitude(
                H_b + (R_s * T_b / g_n) * math.log(p_b / p)
            )
        else:
            return cls.geopotential_to_geometric_altitude(
                H_b + (T_b / B) * ( (p / p_b) ** -(B * R_s / g_n) - 1 )
            )

    @classmethod
    def get_altitude_agl(cls, pressure, pressure_ground):
        """Calculate geometric altitude from ground level.

        :param pressure: Pressure at altitude (atm)
        :type pressure: `int`, `float` or `decimal`
        :param pressure_ground: Pressure at ground level (atm)
        :type pressure_ground: `int`, `float` or `decimal`
        :raises ValueError: Pressure is outside of Standard Atmosphere range
        :return: Geometric altitude from ground level in meters
        :rtype: `float`
        """
        altitude_asl = cls.get_altitude_asl(pressure)
        altitude_ground = cls.get_altitude_asl(pressure_ground)
        return altitude_asl - altitude_ground

    @staticmethod
    def geopotential_to_geometric_altitude(H):
        """Convert geopotential altitude to geometric altitude.

        :param H: Geopotential altitude
        :type H: `int`, `float` or `decimal`
        :return: Geometric altitude
        :rtype: `float`
        """
        # Earth nominal radius (m)
        r = 6356766
        return r * H / (r - H)
