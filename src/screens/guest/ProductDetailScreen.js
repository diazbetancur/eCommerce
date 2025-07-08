const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(product.price);
  const { addToCart } = useCart();

  return (
    <ScrollView style={styles.container}>
      <ProductImage source={product.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* 🔥 PERSONALIZACIÓN - LO QUE NOS DIFERENCIA */}
        {product.customizationGroups?.map((group) => (
          <CustomizationGroup
            key={group.id}
            group={group}
            selected={selectedCustomizations[group.id]}
            onSelect={(options) => updateCustomization(group.id, options)}
          />
        ))}

        {/* Instrucciones especiales */}
        <SpecialInstructions value={specialInstructions} onChange={setSpecialInstructions} />

        {/* Cantidad y precio */}
        <View style={styles.bottomSection}>
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <Text style={styles.finalPrice}>${finalPrice * quantity}</Text>
        </View>

        {/* Botón agregar al carrito */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product, selectedCustomizations, quantity)}
        >
          <Text style={styles.addButtonText}>Agregar al carrito - ${finalPrice * quantity}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
